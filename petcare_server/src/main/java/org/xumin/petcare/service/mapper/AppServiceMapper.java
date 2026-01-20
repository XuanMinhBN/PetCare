package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.xumin.petcare.domain.AppService;
import org.xumin.petcare.service.dto.AppServiceDTO;

@Mapper(componentModel = "spring", uses = {})
public interface AppServiceMapper extends EntityMapper<AppServiceDTO, AppService> {

}
