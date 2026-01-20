package org.xumin.petcare.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.Coupon;
import org.xumin.petcare.domain.Order;
import org.xumin.petcare.domain.OrderCoupon;
import org.xumin.petcare.domain.enumeration.ProductStatus;
import org.xumin.petcare.repository.CouponRepository;
import org.xumin.petcare.repository.OrderCouponRepository;
import org.xumin.petcare.repository.OrderRepository;
import org.xumin.petcare.service.dto.OrderCouponDTO;
import org.xumin.petcare.service.mapper.OrderCouponMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class OrderCouponService {
    private final Logger log = LoggerFactory.getLogger(OrderCouponService.class);
    private final OrderCouponRepository orderCouponRepository;
    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final OrderCouponMapper orderCouponMapper;

    @Autowired
    public OrderCouponService(OrderCouponRepository orderCouponRepository, OrderRepository orderRepository, CouponRepository couponRepository, OrderCouponMapper orderCouponMapper) {
        this.orderCouponRepository = orderCouponRepository;
        this.orderRepository = orderRepository;
        this.couponRepository = couponRepository;
        this.orderCouponMapper = orderCouponMapper;
    }

    @Transactional
    public Optional<OrderCouponDTO> applyCoupon(Long orderId, String couponCode) throws JsonProcessingException {
        log.debug("Applying coupon {} to order {}", couponCode, orderId);

        // Lấy order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Tìm coupon theo code
        Coupon coupon = couponRepository.findCouponByCodeAndStatus(couponCode, ProductStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Coupon invalid or inactive"));

        // Kiểm tra hạn sử dụng
        if (coupon.getExpiry().isBefore(LocalDate.now())) {
            throw new RuntimeException("Coupon expired");
        }

        // Kiểm tra số lần sử dụng
        long usedCount = orderCouponRepository.countByCouponId(coupon.getId());
        if (usedCount >= coupon.getUsageLimit()) {
            throw new RuntimeException("Coupon usage limit exceeded");
        }

        // Kiểm tra điều kiện (nếu có trong JSONB)
        // ví dụ: {"min_order_total": 500000}
        ObjectMapper mapper = new ObjectMapper();
        if (coupon.getConditions() != null && !coupon.getConditions().isBlank()) {
            JsonNode conditions = mapper.readTree(coupon.getConditions());
            if (conditions.has("min_order_total")) {
                BigDecimal minTotal = new BigDecimal(conditions.get("min_order_total").asText());
                if (order.getTotal().compareTo(minTotal) < 0) {
                    throw new RuntimeException("Order total does not meet coupon condition");
                }
            }
        }

        // Tính toán giá trị giảm
        BigDecimal discountValue;
        if (coupon.getType().equals("percent")) {
            discountValue = order.getTotal().multiply(coupon.getValue().divide(BigDecimal.valueOf(100)));
        } else {
            discountValue = coupon.getValue();
        }

        // Giới hạn discount không vượt quá tổng đơn hàng
        if (discountValue.compareTo(order.getTotal()) > 0) {
            discountValue = order.getTotal();
        }

        // Cập nhật đơn hàng
        order.setDiscount(discountValue);
        order.setTotal(order.getTotal().subtract(discountValue));
        orderRepository.save(order);

        // Lưu record order_coupons
        OrderCoupon orderCoupon = new OrderCoupon();
        orderCoupon.setOrder(order);
        orderCoupon.setCoupon(coupon);
        orderCoupon.setAppliedValue(discountValue);
        orderCouponRepository.save(orderCoupon);

        // Trả về DTO
        return Optional.of(orderCouponMapper.toDto(orderCoupon));
    }

}
