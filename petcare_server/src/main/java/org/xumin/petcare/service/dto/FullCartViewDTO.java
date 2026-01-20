package org.xumin.petcare.service.dto;

import org.springframework.data.domain.Page;

import java.time.Instant;

public class FullCartViewDTO {
    private Long id;
    private Instant updatedAt;
    private Double totalPrice;
    private Integer totalItems;
    private Page<CartItemDTO> items;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Page<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(Page<CartItemDTO> items) {
        this.items = items;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }
}
