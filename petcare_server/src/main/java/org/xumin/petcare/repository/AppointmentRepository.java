package org.xumin.petcare.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.xumin.petcare.domain.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {
    Page<Appointment> getAppointmentsByUserId(Long userId, Pageable pageable);
    Appointment findAppointmentById(Long id);
    Page<Appointment> getAppointmentsOrderDesc(Pageable pageable);
    Page<Appointment> getAppointmentsByUserIdOrderByIdDesc(Long userId, Pageable pageable);
}
