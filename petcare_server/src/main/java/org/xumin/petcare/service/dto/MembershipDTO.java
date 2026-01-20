package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.SubscriptionStatus;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

public class MembershipDTO implements Serializable {
    private Long id;
    private LocalDate startAt;
    private LocalDate endAt;
    private SubscriptionStatus status;
    private Instant createdAt;
    private UserAccountDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDate startAt) {
        this.startAt = startAt;
    }

    public LocalDate getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDate endAt) {
        this.endAt = endAt;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public UserAccountDTO getUser() {
        return user;
    }

    public void setUser(UserAccountDTO user) {
        this.user = user;
    }
}
