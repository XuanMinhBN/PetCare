package org.xumin.petcare.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class OrderCouponDTO implements Serializable {
    private Long id;
    private BigDecimal appliedValue;
    private OrderDTO order;
    private CouponDTO coupon;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAppliedValue() {
        return appliedValue;
    }

    public void setAppliedValue(BigDecimal appliedValue) {
        this.appliedValue = appliedValue;
    }

    public OrderDTO getOrder() {
        return order;
    }

    public void setOrder(OrderDTO order) {
        this.order = order;
    }

    public CouponDTO getCoupon() {
        return coupon;
    }

    public void setCoupon(CouponDTO coupon) {
        this.coupon = coupon;
    }
}
