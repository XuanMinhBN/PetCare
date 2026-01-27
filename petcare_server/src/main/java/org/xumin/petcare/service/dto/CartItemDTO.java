package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.Product;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public class CartItemDTO implements Serializable {
    private Long id;
    private Integer quantity;
    private BigDecimal price;
    private Instant createdAt;
    private ProductDTO product;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }
}
