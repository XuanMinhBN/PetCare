package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.AppointmentStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class CreateAppointmentRequestDTO {
    private Long id;
    private Instant timeSlot;
    private BigDecimal price;
    private AppointmentStatus status;
    private Instant createdAt;
    private Long petId;
    private Long serviceId;
    private Long addressId;

    public Instant getTimeSlot() {
        return timeSlot;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setTimeSlot(Instant timeSlot) {
        this.timeSlot = timeSlot;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Long getPetId() {
        return petId;
    }

    public void setPetId(Long petId) {
        this.petId = petId;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }
}
