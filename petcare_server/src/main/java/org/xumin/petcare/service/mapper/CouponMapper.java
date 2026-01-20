package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.xumin.petcare.domain.Coupon;
import org.xumin.petcare.service.dto.CouponDTO;

@Mapper(componentModel = "spring", uses = {})
public interface CouponMapper extends EntityMapper<CouponDTO, Coupon>{
    CouponDTO toDto(Coupon coupon);
    Coupon toEntity(CouponDTO couponDTO);
}
