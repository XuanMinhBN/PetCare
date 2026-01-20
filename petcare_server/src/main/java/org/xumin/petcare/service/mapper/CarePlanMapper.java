package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.xumin.petcare.domain.CarePlan;
import org.xumin.petcare.service.dto.CarePlanDTO;

@Mapper(componentModel = "spring", uses = { PetMapper.class })
public interface CarePlanMapper extends EntityMapper<CarePlanDTO, CarePlan> {
    CarePlanDTO toDto(CarePlan s);
}
