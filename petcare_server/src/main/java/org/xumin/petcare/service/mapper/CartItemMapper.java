package org.xumin.petcare.service.mapper;


import org.mapstruct.Mapper;
import org.xumin.petcare.domain.CartItem;
import org.xumin.petcare.service.dto.CartItemDTO;

@Mapper(componentModel = "spring", uses = { CartMapper.class, ProductMapper.class })
public interface CartItemMapper extends EntityMapper<CartItemDTO, CartItem>{
    CartItemDTO toDto(CartItem s);
}
