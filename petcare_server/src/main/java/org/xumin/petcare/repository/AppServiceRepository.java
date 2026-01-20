package org.xumin.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.xumin.petcare.domain.AppService;

@Repository
public interface AppServiceRepository extends JpaRepository<AppService, Long>, JpaSpecificationExecutor<AppService> {
}
