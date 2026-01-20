package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.xumin.petcare.domain.Order;
import org.xumin.petcare.service.dto.OrderDTO;

@Mapper(componentModel = "spring", uses = { UserAccountMapper.class })
public interface OrderMapper extends EntityMapper<OrderDTO, Order> {
    OrderDTO toDto(Order s);
    Order toEntity(OrderDTO dto);
}
