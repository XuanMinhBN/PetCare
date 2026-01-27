package org.xumin.petcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.Order;
import org.xumin.petcare.domain.OrderItem;
import org.xumin.petcare.domain.Product;
import org.xumin.petcare.domain.enumeration.OrderStatus;
import org.xumin.petcare.repository.OrderRepository;
import org.xumin.petcare.repository.ProductRepository;
import org.xumin.petcare.service.dto.CartItemDTO;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CheckoutService {
    private PayOS payOS;
    private ProductRepository productRepository;
    private OrderRepository orderRepository;

    @Autowired
    public CheckoutService(PayOS payOS, ProductRepository productRepository, OrderRepository orderRepository) {
        this.payOS = payOS;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public String createCheckoutUrl(List<CartItemDTO> cartItems, BigDecimal shippingFee, BigDecimal discount) throws Exception {
        // 1. Khởi tạo Order
        Order order = new Order();
        order.setCreatedAt(Instant.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod("PAYOS");
        order.setShippingFee(shippingFee);
        order.setDiscount(discount);
        // Tạo mã giao dịch cho PayOS (Phải là số duy nhất & trong khoảng cho phép)
        // Dùng thời gian hiện tại là cách đơn giản nhất để không trùng
        long payosOrderCode = Long.parseLong(String.valueOf(System.currentTimeMillis()).substring(0, 10));
        order.setQrTxnId(String.valueOf(payosOrderCode)); // Lưu lại để đối soát Webhook
        // 2. Xử lý OrderItem & Tính tổng tiền hàng
        List<OrderItem> orderItems = new ArrayList<>();
        List<ItemData> payosItems = new ArrayList<>(); // List item để gửi sang PayOS
        BigDecimal subTotal = BigDecimal.ZERO;
        for (CartItemDTO itemDTO : cartItems) {
            Product product = productRepository.findById(itemDTO.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            // Check tồn kho (Optional)
            if (product.getStock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " đã hết hàng");
            }
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
            ItemData payosItem = ItemData.builder()
                    .name(product.getName().length() > 50 ? product.getName().substring(0, 50) : product.getName())
                    .quantity(itemDTO.getQuantity())
                    .price(product.getPrice().intValue())
                    .build();
            payosItems.add(payosItem);
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
        // 4. Gọi API PayOS
        int amountForPayOS = finalTotal.intValue();
        PaymentData paymentData = PaymentData.builder()
                .orderCode(payosOrderCode) // Mã số ta vừa tạo
                .amount(amountForPayOS)
                .description("Thanh toan don hang")
                .returnUrl("http://localhost:3000/success")
                .cancelUrl("http://localhost:3000/cancel")
                .items(payosItems)
                .build();
        CheckoutResponseData data = payOS.createPaymentLink(paymentData);
        return data.getCheckoutUrl();
    }
}
