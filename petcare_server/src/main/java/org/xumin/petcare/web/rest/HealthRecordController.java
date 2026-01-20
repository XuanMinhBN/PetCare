package org.xumin.petcare.web.rest;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xumin.petcare.service.CarePlanService;
import org.xumin.petcare.service.HealthRecordService;
import org.xumin.petcare.service.dto.CarePlanDTO;
import org.xumin.petcare.service.dto.HealthRecordDTO;
import org.xumin.petcare.service.dto.PetDTO;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "http://localhost:3000")
public class HealthRecordController {
    private final Logger log = LoggerFactory.getLogger(HealthRecordController.class);
    private final HealthRecordService healthRecordService;
    private final CarePlanService carePlanService;

    @Autowired
    public HealthRecordController(HealthRecordService healthRecordService, CarePlanService carePlanService) {
        this.healthRecordService = healthRecordService;
        this.carePlanService = carePlanService;
    }

    @PostMapping("/records")
    public ResponseEntity<HealthRecordDTO> createRecord(@Valid @RequestBody HealthRecordDTO healthRecordDTO) throws BadRequestException, URISyntaxException {
        log.debug("REST request to save HealthRecord : {}", healthRecordDTO);
        if (healthRecordDTO.getId() != null) {
            throw new BadRequestException("A new healthRecord cannot already have an ID id exists");
        }
        HealthRecordDTO result = healthRecordService.createRecord(healthRecordDTO);
        return ResponseEntity
                .created(new URI("/api/health/health-records/" + result.getId()))
                .body(result);
    }

    @GetMapping("/records")
    public ResponseEntity<Page<HealthRecordDTO>> listRecords(@RequestParam PetDTO petDTO, @ParameterObject Pageable pageable){
        log.debug("REST request to list HealthRecords by pet: {}", petDTO);
        Page<HealthRecordDTO> records = healthRecordService.getPetHealthRecords(petDTO.getId(), pageable);
        return ResponseEntity.ok().body(records);
    }

    @GetMapping("/care-plans")
    public ResponseEntity<Page<CarePlanDTO>> getCarePlan(@Valid @RequestBody PetDTO petDTO, @ParameterObject Pageable pageable){
        log.debug("REST request to get CarePlan : {}", petDTO);
        Page<CarePlanDTO> carePlans = carePlanService.getPetCarePlans(petDTO.getId(), pageable);
        return ResponseEntity.ok().body(carePlans);
    }

    @PostMapping("/care-plans")
    public ResponseEntity<CarePlanDTO> createCarePlan(@Valid @RequestBody CarePlanDTO carePlanDTO) throws URISyntaxException, BadRequestException {
        log.debug("REST request to save CarePlan : {}", carePlanDTO);
        if (carePlanDTO.getId() != null) {
            throw new BadRequestException("A new care plan cannot already have an ID id exists");
        }
        CarePlanDTO result = carePlanService.createCarePlan(carePlanDTO);
        return ResponseEntity
                .created(new URI("/api/health/care-plans" + result.getId()))
                .body(result);
    }

    @PutMapping("/care-plans/{id}")
    public ResponseEntity<CarePlanDTO> putCarePlan(@PathVariable Long id,
                                                   @Valid @RequestBody CarePlanDTO carePlanDTO) throws BadRequestException {
        log.debug("REST request to update CarePlan : {}, {}", id, carePlanDTO);
        if (carePlanDTO.getId() == null) {
            throw new BadRequestException("Invalid id id null");
        }
        if (!carePlanService.existedId(id)) {
            throw new BadRequestException("Entity not found id not found");
        }

        Optional<CarePlanDTO> result = carePlanService.updateCarePlan(id, carePlanDTO);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }
}
