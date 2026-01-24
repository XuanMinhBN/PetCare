package org.xumin.petcare.service;

import com.sun.jdi.InvalidTypeException;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.*;
import org.xumin.petcare.domain.enumeration.AppointmentStatus;
import org.xumin.petcare.repository.*;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.AppointmentDTO;
import org.xumin.petcare.service.dto.CreateAppointmentRequestDTO;
import org.xumin.petcare.service.mapper.AppoinmentMapper;

import java.time.Instant;

@Service
@Transactional
public class AppointmentService {
    private final Logger log = LoggerFactory.getLogger(AppointmentService.class);
    private final AppointmentRepository appointmentRepository;
    private final UserAccountRepository userAccountRepository;
    private final PetRepository petRepository;
    private final AddressRepository addressRepository;
    private final AppServiceRepository appServiceRepository;
    private final AppoinmentMapper appointmentMapper;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, UserAccountRepository userAccountRepository, PetRepository petRepository, AddressRepository addressRepository, AppServiceRepository appServiceRepository, AppoinmentMapper appointmentMapper) {
        this.appointmentRepository = appointmentRepository;
        this.userAccountRepository = userAccountRepository;
        this.petRepository = petRepository;
        this.addressRepository = addressRepository;
        this.appServiceRepository = appServiceRepository;
        this.appointmentMapper = appointmentMapper;
    }

    @Transactional
    public AppointmentDTO save(AppointmentDTO appointmentDTO) {
        log.debug("Request to save Appointment : {}", appointmentDTO);
        if (appointmentDTO == null) {
            throw new IllegalArgumentException("AppointmentDTO cannot be null");
        }
        Appointment appointment = appointmentMapper.toEntity(appointmentDTO);
        if (appointment.getId() == null) {
            appointment.setCreatedAt(Instant.now());
        }
        appointment.setUpdatedAt(Instant.now());
        Appointment result = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(result);
    }

    @Transactional
    public AppointmentDTO createAppointment(CreateAppointmentRequestDTO requestDTO) throws BadRequestException {
        // 1. LẤY USER TỪ TOKEN - Đây là nguồn thông tin đáng tin cậy duy nhất về danh tính
        String currentUserEmail = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));

        UserAccount currentUser = userAccountRepository.findOneByEmailIgnoreCase(currentUserEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // 2. LẤY CÁC ĐỐI TƯỢNG "THẬT" TỪ CSDL BẰNG ID
        Pet pet = petRepository.findById(requestDTO.getPetId())
                .orElseThrow(() -> new BadRequestException("Pet not found"));

        AppService service = appServiceRepository.findById(requestDTO.getServiceId())
                .orElseThrow(() -> new BadRequestException("Service not found"));

        Address address = addressRepository.findById(requestDTO.getAddressId())
                .orElseThrow(() -> new BadRequestException("Address not found"));

        // 3. (RẤT QUAN TRỌNG) KIỂM TRA XEM THÚ CƯNG VÀ ĐỊA CHỈ CÓ THỰC SỰ THUỘC VỀ USER ĐANG ĐĂNG NHẬP KHÔNG
        if (!pet.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("User does not own this pet.");
        }
        if (!address.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("User does not own this address.");
        }

        // 4. TẠO VÀ LƯU APPOINTMENT MỚI VỚI CÁC ĐỐI TƯỢNG "THẬT"
        Appointment newAppointment = new Appointment();
        newAppointment.setTimeSlot(requestDTO.getTimeSlot());
        newAppointment.setStatus(AppointmentStatus.PENDING);

        newAppointment.setUser(currentUser); // Gán user "thật"
        newAppointment.setPet(pet);           // Gán pet "thật"
        newAppointment.setService(service);   // Gán service "thật"
        newAppointment.setAddress(address);   // Gán address "thật"

        // ... tính toán giá tiền, v.v...
        newAppointment.setPrice(service.getBasePrice());
        Appointment savedAppointment = appointmentRepository.save(newAppointment);

        return appointmentMapper.toDto(savedAppointment);
    }

    @Transactional(readOnly = true)
    public Page<AppointmentDTO> getAppointmentsCurrenUser(Pageable pageable) {
        log.debug("Request to get appointments by current user");
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return userAccountRepository.findOneByEmailIgnoreCase(username)
                .map(userAccount -> {
                    return appointmentRepository.getAppointmentsByUserId(userAccount.getId(), pageable)
                            .map(appointmentMapper::toDto);
                })
                .orElse(Page.empty(pageable));
    }

    @Transactional(readOnly = true)
    public AppointmentDTO getAppointment(Long appointmentId) {
        log.debug("Request to get appointment : {}", appointmentId);
        Appointment appointment = appointmentRepository.findAppointmentById(appointmentId);
        return appointmentMapper.toDto(appointment);
    }

    @Transactional(readOnly = true)
    public Page<AppointmentDTO> getAllAppointments(Pageable pageable) {
        log.debug("Request to get all appointments");
        Page<Appointment> appointment = appointmentRepository.findAll(pageable);
        return appointment.map(appointmentMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<AppointmentDTO> getAllAppointmentsOrderDesc(Pageable pageable) {
        log.debug("Request to get all appointments desc");
        Page<Appointment> appointment = appointmentRepository.getAllByOrderByIdDesc(pageable);
        return appointment.map(appointmentMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<AppointmentDTO> getAppointmentsDesc(Pageable pageable) {
        log.debug("Request to get all appointments by date");
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return userAccountRepository.findOneByEmailIgnoreCase(username)
                .map(userAccount -> {
                    return appointmentRepository.getAppointmentsByUserIdOrderByIdDesc(userAccount.getId(), pageable)
                            .map(appointmentMapper::toDto);
                })
                .orElse(Page.empty(pageable));
    }

    @Transactional
    public AppointmentDTO confirmAppointment(Long id) throws BadRequestException, InvalidTypeException {
        // 1. Tìm entity, nếu không thấy sẽ ném lỗi
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Appointment not found with id: " + id));

        // 2. Kiểm tra logic nghiệp vụ (ví dụ: chỉ xác nhận lịch hẹn đang chờ)
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new InvalidTypeException("Only PENDING appointments can be confirmed.");
        }

        // 3. Cập nhật trạng thái
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        // 4. Lưu và trả về DTO
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(savedAppointment);
    }

    @Transactional
    public AppointmentDTO cancelAppointment(Long id) throws BadRequestException, InvalidTypeException {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Appointment not found with id: " + id));

        // Ví dụ: Lịch hẹn đã hoàn thành thì không thể hủy
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new InvalidTypeException("Cannot cancel a COMPLETED appointment.");
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(savedAppointment);
    }

    @Transactional
    public AppointmentDTO completeAppointment(Long id) throws BadRequestException, InvalidTypeException {
        // 1. Tìm entity, nếu không thấy sẽ ném lỗi
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Appointment not found with id: " + id));

        // 2. Kiểm tra logic nghiệp vụ (quan trọng)
        // Chỉ cho phép hoàn thành một lịch hẹn đã được xác nhận.
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new InvalidTypeException(
                    "Only CONFIRMED appointments can be completed. Current status is: " + appointment.getStatus()
            );
        }

        // 3. Cập nhật trạng thái
        appointment.setStatus(AppointmentStatus.COMPLETED);

        // 4. Lưu và trả về DTO
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(savedAppointment);
    }

    @Transactional
    public boolean existedId(Long appointmentId) {
        return appointmentRepository.existsById(appointmentId);
    }
}
