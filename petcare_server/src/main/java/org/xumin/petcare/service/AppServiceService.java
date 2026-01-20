package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.repository.AppServiceRepository;
import org.xumin.petcare.service.dto.AppServiceDTO;
import org.xumin.petcare.service.mapper.AppServiceMapper;

import java.util.Optional;

@Service
public class AppServiceService {
    private final Logger log = LoggerFactory.getLogger(AppServiceService.class);
    private final AppServiceRepository appServiceRepository;
    private final AppServiceMapper appServiceMapper;

    @Autowired
    public AppServiceService(AppServiceRepository appServiceRepository, AppServiceMapper appServiceMapper) {
        this.appServiceRepository = appServiceRepository;
        this.appServiceMapper = appServiceMapper;
    }

    @Transactional(readOnly = true)
    public Page<AppServiceDTO> getAllAppServices(Pageable pageable) {
        log.debug("Request to get all AppServices");
        return appServiceRepository.findAll(pageable).map(appServiceMapper::toDto);
    }

    @Transactional
    public AppServiceDTO createAppService(AppServiceDTO appServiceDTO) {
        log.debug("Request to create AppService");
        return appServiceMapper.toDto(appServiceRepository.save(appServiceMapper.toEntity(appServiceDTO)));
    }

    @Transactional
    public Optional<AppServiceDTO> updateAppService(Long id, AppServiceDTO appServiceDTO) {
        log.debug("Request to update AppService");
        return appServiceRepository
                .findById(id)
                .map(existingPet -> {
                    appServiceMapper.partialUpdate(existingPet, appServiceDTO);
                    return existingPet;
                })
                .map(appServiceRepository::save)
                .map(appServiceMapper::toDto);
    }

    @Transactional
    public void deleteAppService(Long id) {
        log.debug("Request to delete Product : {}", id);
        appServiceRepository.deleteById(id);
    }

    @Transactional
    public boolean existedId(Long petId) {
        return appServiceRepository.existsById(petId);
    }
}
