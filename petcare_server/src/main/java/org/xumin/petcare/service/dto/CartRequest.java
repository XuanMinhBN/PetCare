package org.xumin.petcare.service.dto;

import org.xumin.petcare.domain.CartItem;

import java.math.BigDecimal;
import java.util.List;

public class CartRequest {
    private List<CartItemDTO> items;
    private BigDecimal shippingFee;
    private BigDecimal discount;

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }
}
