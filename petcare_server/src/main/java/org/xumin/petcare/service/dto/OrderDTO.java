package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.OrderStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public class OrderDTO implements Serializable {
    private Long id;
    private BigDecimal total;
    private BigDecimal discount;
    private BigDecimal shippingFee;
    private String paymentMethod;
    private OrderStatus status;
    private String qrTxnId;
    private Instant createdAt;
    private Instant paidAt;
    private UserAccountDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getQrTxnId() {
        return qrTxnId;
    }

    public void setQrTxnId(String qrTxnId) {
        this.qrTxnId = qrTxnId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(Instant paidAt) {
        this.paidAt = paidAt;
    }

    public UserAccountDTO getUser() {
        return user;
    }

    public void setUser(UserAccountDTO user) {
        this.user = user;
    }
}
