package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.xumin.petcare.domain.Cart;
import org.xumin.petcare.service.dto.CartDTO;

@Mapper(componentModel = "spring", uses = {UserAccountMapper.class})
public interface CartMapper extends EntityMapper<CartDTO, Cart>{
}
