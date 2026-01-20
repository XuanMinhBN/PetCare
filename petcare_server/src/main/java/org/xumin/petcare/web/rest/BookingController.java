package org.xumin.petcare.web.rest;

import com.sun.jdi.InvalidTypeException;
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
import org.xumin.petcare.domain.enumeration.AppointmentStatus;
import org.xumin.petcare.service.AppServiceService;
import org.xumin.petcare.service.AppointmentService;
import org.xumin.petcare.service.NotificationService;
import org.xumin.petcare.service.dto.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Objects;

@RestController
@RequestMapping("/api/booking")
//@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    private final Logger log = LoggerFactory.getLogger(BookingController.class);
    private final AppointmentService appointmentService;
    private final NotificationService notificationService;
    private final AppServiceService appServiceService;

    @Autowired
    public BookingController(AppointmentService appointmentService, NotificationService notificationService, AppServiceService appServiceService) {
        this.appointmentService = appointmentService;
        this.notificationService = notificationService;
        this.appServiceService = appServiceService;
    }

    // Services catalog for booking
    @GetMapping("/services")
    public ResponseEntity<Page<AppServiceDTO>> listServices(@ParameterObject Pageable pageable){
        log.debug("REST request to list services pageable : {}", pageable);
        Page<AppServiceDTO> page = appServiceService.getAllAppServices(pageable);
        return ResponseEntity.ok().body(page);
    }

    // Create appointment
    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDTO> create(@Valid @RequestBody CreateAppointmentRequestDTO requestDTO) throws BadRequestException, URISyntaxException {
        log.debug("REST request to create Appointment : {}", requestDTO);

        // Gọi đến service để thực hiện toàn bộ logic nghiệp vụ
        AppointmentDTO result = appointmentService.createAppointment(requestDTO);

        // Trả về response 201 Created, kèm theo URI của tài nguyên vừa được tạo
        return ResponseEntity
                .created(new URI("/api/appointments/" + result.getId()))
                .body(result);
    }

    // Query appointments of current user
    @GetMapping("/appointments")
    public ResponseEntity<Page<AppointmentDTO>> myAppointments(@ParameterObject Pageable pageable){
        log.debug("REST request to get a page of appointments");
        Page<AppointmentDTO> page = appointmentService.getAppointmentsCurrenUser(pageable);
        return ResponseEntity.ok().body(page);
    }

    @GetMapping("/users/appointments")
    public ResponseEntity<Page<AppointmentDTO>> getAllAppointments(@ParameterObject Pageable pageable){
        log.debug("REST request to get a page of all appointments");
        Page<AppointmentDTO> page = appointmentService.getAllAppointmentsOrderDesc(pageable);
        return ResponseEntity.ok().body(page);
    }

    // Staff actions
    @PatchMapping("/appointments/{id}/confirm")
    public ResponseEntity<AppointmentDTO> confirm(@PathVariable(value = "id", required = false) Long id) throws BadRequestException, InvalidTypeException {
        log.debug("REST request to confirm appointment");
        AppointmentDTO result = appointmentService.confirmAppointment(id);
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setType("APPOINTMENT_CONFIRMED");
        notificationDTO.setTitle("Appointment Confirmed");
        notificationDTO.setBody("Your appointment has been confirmed");
        notificationDTO.setSeen(false);
        notificationDTO.setCreatedAt(Instant.now());
        NotificationDTO notification = notificationService.createNotification(
                result.getUser().getId(),
                notificationDTO
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentDTO> cancel(@PathVariable(value = "id", required = false) Long id) throws BadRequestException, InvalidTypeException {
        log.debug("REST request to cancel appointment");
        AppointmentDTO result = appointmentService.cancelAppointment(id);
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setType("APPOINTMENT_CANCELLED");
        notificationDTO.setTitle("Appointment Canceled");
        notificationDTO.setBody("Your appointment has been canceled");
        notificationDTO.setSeen(false);
        notificationDTO.setCreatedAt(Instant.now());
        NotificationDTO notification = notificationService.createNotification(
                result.getUser().getId(),
                notificationDTO
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/appointments/{id}/complete")
    public ResponseEntity<AppointmentDTO> complete(@PathVariable(value = "id", required = false) Long id) throws BadRequestException, InvalidTypeException {
        log.debug("REST request to complete appointment");
        AppointmentDTO result = appointmentService.completeAppointment(id);
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setType("APPOINTMENT_COMPLETED");
        notificationDTO.setTitle("Appointment Completed");
        notificationDTO.setBody("Your appointment has been completed");
        notificationDTO.setSeen(false);
        notificationDTO.setCreatedAt(Instant.now());
        NotificationDTO notification = notificationService.createNotification(
                result.getUser().getId(),
                notificationDTO
        );
        return ResponseEntity.ok(result);
    }

}
