package org.xumin.petcare.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.xumin.petcare.domain.CarePlan;

import java.util.Optional;

@Repository
public interface CarePlanRepository extends JpaRepository<CarePlan, Long>, JpaSpecificationExecutor<CarePlan> {
    Page<CarePlan> findCarePlansByPetId(Long petId, Pageable pageable);
    Optional<CarePlan> findCarePlanByPetId(Long petId);
}
