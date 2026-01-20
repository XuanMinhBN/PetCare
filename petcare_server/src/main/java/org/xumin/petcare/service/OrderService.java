package org.xumin.petcare.service;

import com.sun.jdi.InvalidTypeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.Cart;
import org.xumin.petcare.domain.Order;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.domain.enumeration.OrderStatus;
import org.xumin.petcare.repository.CartItemRepository;
import org.xumin.petcare.repository.CartRepository;
import org.xumin.petcare.repository.OrderRepository;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.OrderDTO;
import org.xumin.petcare.service.mapper.OrderMapper;

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

    @Autowired
    public OrderService(OrderRepository orderRepository, UserAccountRepository accountRepository, CartItemRepository cartItemRepository, CartRepository cartRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.accountRepository = accountRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.orderMapper = orderMapper;
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
}
