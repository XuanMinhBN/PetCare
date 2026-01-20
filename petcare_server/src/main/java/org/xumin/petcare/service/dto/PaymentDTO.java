package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.PaymentStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public class PaymentDTO implements Serializable {
    private Long id;
    private String provider;
    private String qrPayload;
    private PaymentStatus status;
    private BigDecimal amount;
    private String providerTxnId;
    private Instant createdAt;
    private Instant confirmedAt;
    private OrderDTO order;
    private MembershipDTO subscription;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getQrPayload() {
        return qrPayload;
    }

    public void setQrPayload(String qrPayload) {
        this.qrPayload = qrPayload;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getProviderTxnId() {
        return providerTxnId;
    }

    public void setProviderTxnId(String providerTxnId) {
        this.providerTxnId = providerTxnId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(Instant confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public OrderDTO getOrder() {
        return order;
    }

    public void setOrder(OrderDTO order) {
        this.order = order;
    }

    public MembershipDTO getSubscription() {
        return subscription;
    }

    public void setSubscription(MembershipDTO subscription) {
        this.subscription = subscription;
    }
}
