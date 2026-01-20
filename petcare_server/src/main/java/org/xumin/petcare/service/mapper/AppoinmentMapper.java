package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.xumin.petcare.domain.Appointment;
import org.xumin.petcare.service.dto.AppointmentDTO;

@Mapper(componentModel = "spring", uses = {UserAccountMapper.class, PetMapper.class, AppServiceMapper.class, AddressMapper.class})
public interface AppoinmentMapper extends EntityMapper<AppointmentDTO, Appointment> {
    @Mapping(source = "user", target = "user")
    @Mapping(source = "pet", target = "pet")
    @Mapping(source = "service", target = "service")
    @Mapping(source = "address", target = "address")
    @Override
    AppointmentDTO toDto(Appointment s);
}
