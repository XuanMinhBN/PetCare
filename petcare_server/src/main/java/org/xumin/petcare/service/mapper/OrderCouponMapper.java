package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.xumin.petcare.domain.OrderCoupon;
import org.xumin.petcare.service.dto.OrderCouponDTO;

@Mapper(componentModel = "spring", uses = { OrderMapper.class, CouponMapper.class })
public interface OrderCouponMapper {
    OrderCouponDTO toDto(OrderCoupon s);
    OrderCoupon toEntity(OrderCouponDTO dto);
}
