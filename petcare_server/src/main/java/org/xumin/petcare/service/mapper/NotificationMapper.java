package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.xumin.petcare.domain.Notification;
import org.xumin.petcare.service.dto.NotificationDTO;

@Mapper(componentModel = "spring", uses = { UserAccountMapper.class })
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {
    @Mapping(source = "user", target = "user")
    @Override
    NotificationDTO toDto(Notification notification);
}
