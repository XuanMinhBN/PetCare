package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.repository.CarePlanRepository;
import org.xumin.petcare.service.dto.CarePlanDTO;
import org.xumin.petcare.service.mapper.CarePlanMapper;

import java.util.Optional;

@Service
@Transactional
public class CarePlanService {
    private final Logger log = LoggerFactory.getLogger(CarePlanService.class);
    private final CarePlanRepository carePlanRepository;
    private final CarePlanMapper carePlanMapper;

    @Autowired
    public CarePlanService(CarePlanRepository carePlanRepository, CarePlanMapper carePlanMapper) {
        this.carePlanRepository = carePlanRepository;
        this.carePlanMapper = carePlanMapper;
    }

    @Transactional(readOnly = true)
    public Page<CarePlanDTO> getPetCarePlans(Long petId, Pageable pageable) {
        log.debug("Request getPetCarePlans petId: {}", petId);
        return carePlanRepository.findCarePlansByPetId(petId, pageable).map(carePlanMapper::toDto);
    }

    @Transactional
    public CarePlanDTO createCarePlan(CarePlanDTO carePlanDTO) {
        log.debug("Request to create HealthRecord: {}", carePlanDTO);
        return carePlanMapper.toDto(carePlanRepository.save(carePlanMapper.toEntity(carePlanDTO)));
    }

    @Transactional
    public Optional<CarePlanDTO> updateCarePlan(Long id, CarePlanDTO carePlanDTO) {
        log.debug("Request to partially update CarePlan : {}", carePlanDTO);
        return carePlanRepository
                .findById(id)
                .map(existingCarePlan -> {
                    carePlanMapper.partialUpdate(existingCarePlan, carePlanDTO);
                    return existingCarePlan;
                })
                .map(carePlanRepository::save)
                .map(carePlanMapper::toDto);
    }

    @Transactional
    public boolean existedId(Long appointmentId) {
        return carePlanRepository.existsById(appointmentId);
    }
}
