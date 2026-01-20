package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.ProductStatus;
import org.xumin.petcare.domain.enumeration.ServiceType;

import java.io.Serializable;
import java.math.BigDecimal;

public class AppServiceDTO implements Serializable {
    private Long id;
    private String name;
    private ServiceType type;
    private String description;
    private BigDecimal basePrice;
    private ProductStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ServiceType getType() {
        return type;
    }

    public void setType(ServiceType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }
}
