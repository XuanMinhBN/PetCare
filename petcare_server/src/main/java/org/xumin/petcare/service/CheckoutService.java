package org.xumin.petcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.xumin.petcare.config.PayOSProperties;
import org.xumin.petcare.domain.*;
import org.xumin.petcare.domain.enumeration.OrderStatus;
import org.xumin.petcare.repository.*;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.CartItemDTO;
import org.xumin.petcare.service.dto.PayOSRequest;
import org.xumin.petcare.service.dto.PayOSResponse;
import org.xumin.petcare.utils.PayOSUtils;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;


@Service
@Transactional
public class CheckoutService {
    private final PayOSProperties payOSProps;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserAccountRepository userAccountRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;


    @Autowired
    public CheckoutService(PayOSProperties payOSProps, ProductRepository productRepository, OrderRepository orderRepository, UserAccountRepository userAccountRepository, CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.payOSProps = payOSProps;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userAccountRepository = userAccountRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public String createCheckoutUrl(List<CartItemDTO> cartItems, BigDecimal shippingFee, BigDecimal discount) throws Exception {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Bạn cần đăng nhập để thanh toán"));
        UserAccount userAccount = userAccountRepository.findOneByEmailIgnoreCase(currentUserLogin)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng"));
        // 1. Khởi tạo Order
        Order order = new Order();
        order.setCreatedAt(Instant.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod("PAYOS");
        order.setShippingFee(shippingFee);
        order.setDiscount(discount);
        order.setUser(userAccount);
        // Tạo mã giao dịch cho PayOS (Phải là số duy nhất & trong khoảng cho phép)
        // Dùng thời gian hiện tại là cách đơn giản nhất để không trùng
        String timeStr = String.valueOf(System.currentTimeMillis());
        String randomStr = String.valueOf(ThreadLocalRandom.current().nextInt(100, 999));
        long payosOrderCode = Long.parseLong(timeStr + randomStr);
        order.setQrTxnId(String.valueOf(payosOrderCode)); // Lưu lại để đối soát Webhook
        // 2. Xử lý OrderItem & Tính tổng tiền hàng
        List<OrderItem> orderItems = new ArrayList<>();
//        List<ItemData> payosItems = new ArrayList<>(); // List item để gửi sang PayOS
        BigDecimal subTotal = BigDecimal.ZERO;
        for (CartItemDTO itemDTO : cartItems) {
            Product product = productRepository.findById(itemDTO.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            // Check tồn kho (Optional)
            if (product.getStock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " đã hết hàng");
            }
            int newStock = product.getStock() - itemDTO.getQuantity();
            product.setStock(newStock);
            productRepository.save(product);
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            // Cộng dồn vào subTotal
            subTotal = subTotal.add(itemTotal);
            // Tạo OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setOrder(order);
            orderItem.setQty(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice()); // Lưu giá tại thời điểm mua
            orderItems.add(orderItem);
            // Tạo item data cho PayOS (Để hiển thị trên màn hình thanh toán)
            // Lưu ý: PayOS yêu cầu tên không quá dài và không chứa ký tự đặc biệt lạ
//            ItemData payosItem = ItemData.builder()
//                    .name(product.getName().length() > 50 ? product.getName().substring(0, 50) : product.getName())
//                    .quantity(itemDTO.getQuantity())
//                    .price(product.getPrice().intValue())
//                    .build();
//            payosItems.add(payosItem);
        }
        order.setOrderItems(orderItems);
        // 3. Tính Tổng cuối cùng (Final Total)
        // Công thức: (SubTotal - Discount) + ShippingFee
        // Lưu ý: Dùng .max(BigDecimal.ZERO) để đảm bảo không bao giờ bị âm
        BigDecimal finalTotal = subTotal.subtract(discount).add(shippingFee);
        // PayOS yêu cầu số tiền phải là số nguyên (Integer)
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) {
            finalTotal = BigDecimal.ZERO;
        }
        order.setTotal(finalTotal);
        // Lưu Order vào DB trước khi gọi PayOS
        orderRepository.save(order);
        Cart cart = cartRepository.findCartByUserId(userAccount.getId())
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        cartItemRepository.deleteAllByCartId(cart.getId());
        // 4. Gọi API PayOS
        int amountForPayOS = finalTotal.intValue();
//        PaymentData paymentData = PaymentData.builder()
//                .orderCode(payosOrderCode) // Mã số ta vừa tạo
//                .amount(amountForPayOS)
//                .description("ThanhToan")
//                .returnUrl("http://localhost:3000/success")
//                .cancelUrl("http://localhost:3000/cancel")
//                .items(payosItems)
//                .build();
//        CheckoutResponseData data = payOS.createPaymentLink(paymentData);
//        return data.getCheckoutUrl();
        String checksumKey = payOSProps.getChecksumKey();
        String clientId = payOSProps.getClientId();
        String apiKey = payOSProps.getApiKey();

        PayOSRequest requestBody = new PayOSRequest();
        requestBody.setOrderCode(payosOrderCode);
        requestBody.setAmount(amountForPayOS);
        requestBody.setDescription("ThanhToanDonHang");
        requestBody.setCancelUrl("https://petcare-application.vercel.app/cancel");
        requestBody.setReturnUrl("https://petcare-application.vercel.app/success");
                // .items(...) // Tạm thời bỏ items để đảm bảo API chạy 100% không lỗi format

        String signature = PayOSUtils.createSignature(checksumKey.trim(), requestBody);
        requestBody.setSignature(signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-client-id", clientId.trim());
        headers.set("x-api-key", apiKey.trim());

        HttpEntity<PayOSRequest> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            String url = "https://api-merchant.payos.vn/v2/payment-requests";
            PayOSResponse response = restTemplate.postForObject(url, entity, PayOSResponse.class);
            if (response != null && "00".equals(response.getCode())) {
                return response.getData().getCheckoutUrl();
            } else {
                throw new RuntimeException("PayOS Error: " + (response != null ? response.getDesc() : "Unknown"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi gọi PayOS: " + e.getMessage());
        }
    }
}
