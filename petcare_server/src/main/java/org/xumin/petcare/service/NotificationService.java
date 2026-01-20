package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.Notification;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.repository.NotificationRepository;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.NotificationDTO;
import org.xumin.petcare.service.mapper.NotificationMapper;

import java.util.Optional;

@Service
@Transactional
public class NotificationService {
    private final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;
    private final UserAccountRepository accountRepository;
    private final NotificationMapper notificationMapper;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserAccountRepository accountRepository, NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.accountRepository = accountRepository;
        this.notificationMapper = notificationMapper;
    }

    @Transactional(readOnly = true)
    public Page<NotificationDTO> getCurrentUserNotifications(Pageable pageable) {
        log.debug("Request getCurrentUserNotifications Pageable: {}", pageable);
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return accountRepository.findOneByEmailIgnoreCase(username)
                .map(userAccount -> {
                    // Nếu user tồn tại, dùng ID để tìm thông báo
                    return notificationRepository.findNotificationsByUserIdOrderByCreatedAtDesc(userAccount.getId(), pageable)
                            .map(notificationMapper::toDto);
                })
                .orElse(Page.empty());
    }

    @Transactional
    public NotificationDTO createNotification(Long userId, NotificationDTO notificationDTO) {
        log.debug("Request to create Notification: {}", notificationDTO);
        UserAccount userAccount = accountRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        Notification notification = notificationMapper.toEntity(notificationDTO);
        notification.setUser(userAccount);
        Notification result = notificationRepository.save(notification);
        return notificationMapper.toDto(result);
    }

    @Transactional
    public Optional<NotificationDTO> updateNotification(Long id, NotificationDTO notificationDTO) {
        log.debug("Request to update Notification: {}", notificationDTO);
        return notificationRepository
                .findById(id)
                .map(existingNotification -> {
                    notificationMapper.partialUpdate(existingNotification, notificationDTO);
                    return existingNotification;
                })
                .map(notificationRepository::save)
                .map(notificationMapper::toDto);
    }

    @Transactional
    public boolean existedId(Long notificationId) {
        return notificationRepository.existsById(notificationId);
    }
}
