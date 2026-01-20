package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.xumin.petcare.domain.Address;
import org.xumin.petcare.service.dto.AddressDTO;

@Mapper(componentModel = "spring", uses = { UserAccountMapper.class })
public interface AddressMapper extends EntityMapper<AddressDTO, Address> {
    @Mapping(source = "user", target = "user")
    @Override
    AddressDTO toDto(Address s);
}
