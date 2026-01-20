package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.xumin.petcare.domain.HealthRecord;
import org.xumin.petcare.service.dto.HealthRecordDTO;

@Mapper(componentModel = "spring", uses = { PetMapper.class })
public interface HealthRecordMapper extends EntityMapper<HealthRecordDTO, HealthRecord>{
    HealthRecordDTO toDto(HealthRecord s);
}
