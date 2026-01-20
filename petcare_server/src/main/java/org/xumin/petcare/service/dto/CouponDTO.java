package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.enumeration.CouponType;
import org.xumin.petcare.domain.enumeration.ProductStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CouponDTO implements Serializable {
    private Long id;
    private String code;
    private CouponType type;
    private BigDecimal value;
    private LocalDate expiry;
    private Integer usageLimit;
    private String conditions;
    private ProductStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CouponType getType() {
        return type;
    }

    public void setType(CouponType type) {
        this.type = type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public LocalDate getExpiry() {
        return expiry;
    }

    public void setExpiry(LocalDate expiry) {
        this.expiry = expiry;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public String getConditions() {
        return conditions;
    }

    public void setConditions(String conditions) {
        this.conditions = conditions;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }
}
