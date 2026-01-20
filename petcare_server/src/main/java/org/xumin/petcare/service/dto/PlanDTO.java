package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.PlanName;
import org.xumin.petcare.domain.enumeration.PlanStatus;

import java.io.Serializable;
import java.math.BigDecimal;

public class PlanDTO implements Serializable {
    private Long id;
    private PlanName name;
    private BigDecimal price;
    private String features;
    private PlanStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlanName getName() {
        return name;
    }

    public void setName(PlanName name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public PlanStatus getStatus() {
        return status;
    }

    public void setStatus(PlanStatus status) {
        this.status = status;
    }
}
