package org.xumin.petcare.service;

import com.sun.jdi.InvalidTypeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.*;
import org.xumin.petcare.domain.enumeration.OrderStatus;
import org.xumin.petcare.repository.*;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.OrderDTO;
import org.xumin.petcare.service.mapper.OrderMapper;
import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

@Service
@Transactional
public class OrderService {
    private final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final UserAccountRepository accountRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final OrderMapper orderMapper;
    private final PayOS payOS;
    private final ProductRepository productRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserAccountRepository accountRepository, CartItemRepository cartItemRepository, CartRepository cartRepository, OrderMapper orderMapper, PayOS payOS, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.accountRepository = accountRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.orderMapper = orderMapper;
        this.payOS = payOS;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderDTO create(OrderDTO orderDTO) {
        log.debug("Request to save Appointment : {}", orderDTO);
        if (orderDTO == null) {
            throw new IllegalArgumentException("AppointmentDTO cannot be null");
        }
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        UserAccount userAccount = accountRepository.findOneByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Order order = orderMapper.toEntity(orderDTO);
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(Instant.now());
        order.setUser(userAccount);
        Order result = orderRepository.save(order);
        Cart cart = cartRepository.findCartByUserId(userAccount.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cartItemRepository.deleteAllByCartId(cart.getId());
        return orderMapper.toDto(result);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getOrdersCurrentUser(Pageable pageable) {
        log.debug("Request to get orders currentUser");
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return accountRepository.findOneByEmailIgnoreCase(username)
                .map(userAccount -> {
                    // Nếu user tồn tại, dùng ID để tìm địa chỉ
                    return orderRepository.findOrdersByUserId(userAccount.getId(), pageable)
                            .map(orderMapper::toDto);
                })
                // Nếu không tìm thấy user, trả về một trang rỗng
                .orElse(Page.empty(pageable));
    }

    @Transactional(readOnly = true)
    public Optional<OrderDTO> getOrder(Long orderId) {
        log.debug("Request to get order : {}", orderId);
        return orderRepository.findOrderById(orderId).map(orderMapper::toDto);
    }

    @Transactional
    public OrderDTO cancelOrder(Long id) throws InvalidTypeException {
        log.debug("Request to confirm order : {}", id);
        Order order = orderRepository.findOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getStatus() != OrderStatus.CREATED) {
            throw new InvalidTypeException("Cannot cancel a PAID order.");
        }
        order.setStatus(OrderStatus.CANCELED);
        Order newOrder = orderRepository.save(order);
        return orderMapper.toDto(newOrder);
    }

    @Transactional
    public boolean existedId(Long orderId) {
        return orderRepository.existsById(orderId);
    }

    public void handlePayOSWebhook(Webhook webhookBody) throws Exception {
        // 1. Verify dữ liệu (Chống giả mạo)
        WebhookData data = payOS.verifyPaymentWebhookData(webhookBody);

        // 2. Tìm đơn hàng
        String orderCodeStr = String.valueOf(data.getOrderCode());
        Order order = orderRepository.findOrderByQrTxnId(orderCodeStr)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã: " + orderCodeStr));
        // 3. Kiểm tra trạng thái để tránh xử lý trùng lặp
        if ("PAID".equals(order.getStatus())) {
            return; // Đã thanh toán rồi thì thôi, không làm gì cả
        }
        // 4. Kiểm tra số tiền (Convert int từ Webhook sang BigDecimal)
        BigDecimal amountPaid = BigDecimal.valueOf(data.getAmount());
        // Nếu tiền thanh toán < tổng đơn -> Báo lỗi hoặc xử lý "thanh toán thiếu"
        if (amountPaid.compareTo(order.getTotal()) < 0) {
            throw new RuntimeException("Số tiền thanh toán không đủ!");
        }
        // 5. Cập nhật trạng thái Order
        order.setStatus(OrderStatus.PAID);
        order.setPaidAt(Instant.now());
        orderRepository.save(order);
        // 6. Trừ tồn kho (Inventory)
        updateInventory(order);
    }

    // Tách hàm con cho code gọn gàng
    private void updateInventory(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            // Logic trừ kho
            int currentStock = product.getStock();
            int qtySold = item.getQty();
            if (currentStock < qtySold) {
                // Tùy nghiệp vụ: Có thể throw lỗi để rollback giao dịch
                // Hoặc log lại để nhân viên xử lý thủ công
                throw new RuntimeException("Sản phẩm " + product.getSku() + " không đủ tồn kho!");
            }
            product.setStock(currentStock - qtySold);
            productRepository.save(product);
        }
    }
}
