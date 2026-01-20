package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.repository.HealthRecordRepository;
import org.xumin.petcare.service.dto.HealthRecordDTO;
import org.xumin.petcare.service.mapper.HealthRecordMapper;

@Service
@Transactional
public class HealthRecordService {
    private final Logger log = LoggerFactory.getLogger(HealthRecordService.class);
    private final HealthRecordRepository healthRecordRepository;
    private final HealthRecordMapper healthRecordMapper;

    @Autowired
    public HealthRecordService(HealthRecordRepository healthRecordRepository, HealthRecordMapper healthRecordMapper) {
        this.healthRecordRepository = healthRecordRepository;
        this.healthRecordMapper = healthRecordMapper;
    }

    @Transactional(readOnly = true)
    public Page<HealthRecordDTO> getPetHealthRecords(Long petId, Pageable pageable) {
        log.debug("Request getPetHealthRecords petId: {}", petId);
        return healthRecordRepository.findHealthRecordsByPetId(petId, pageable).map(healthRecordMapper::toDto);
    }

    @Transactional
    public HealthRecordDTO createRecord(HealthRecordDTO healthRecordDTO) {
        log.debug("Request to create HealthRecord: {}", healthRecordDTO);
        return healthRecordMapper.toDto(healthRecordRepository.save(healthRecordMapper.toEntity(healthRecordDTO)));
    }
}
