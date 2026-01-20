package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.xumin.petcare.domain.Pet;
import org.xumin.petcare.service.dto.PetDTO;

@Mapper(componentModel = "spring", uses = { UserAccountMapper.class })
public interface PetMapper extends EntityMapper<PetDTO, Pet>{
    @Mapping(source = "user", target = "user")
    @Override
    PetDTO toDto(Pet s);
}
