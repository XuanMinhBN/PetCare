package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.AppointmentStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public class AppointmentDTO implements Serializable {
    private Long id;
    private Instant timeSlot;
    private BigDecimal price;
    private AppointmentStatus status;
    private Instant createdAt;
    private UserAccountDTO user;
    private PetDTO pet;
    private AppServiceDTO service;
    private AddressDTO address;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(Instant timeSlot) {
        this.timeSlot = timeSlot;
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

    public UserAccountDTO getUser() {
        return user;
    }

    public void setUser(UserAccountDTO user) {
        this.user = user;
    }

    public PetDTO getPet() {
        return pet;
    }

    public void setPet(PetDTO pet) {
        this.pet = pet;
    }

    public AppServiceDTO getService() {
        return service;
    }

    public void setService(AppServiceDTO service) {
        this.service = service;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }
}
