package org.xumin.petcare.service;

import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.xumin.petcare.domain.Cart;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.domain.enumeration.Role;
import org.xumin.petcare.repository.CartRepository;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.UserAccountDTO;
import org.xumin.petcare.service.mapper.UserAccountMapper;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserAccountService {
    private final Logger log = LoggerFactory.getLogger(UserAccountService.class);
    private final UserAccountRepository userAccountRepository;
    private final CartRepository cartRepository;
    private final UserAccountMapper userAccountMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    @Autowired
    public UserAccountService(UserAccountRepository userAccountRepository, CartRepository cartRepository, UserAccountMapper userAccountMapper, PasswordEncoder passwordEncoder, FileStorageService fileStorageService, EmailService emailService) {
        this.userAccountRepository = userAccountRepository;
        this.cartRepository = cartRepository;
        this.userAccountMapper = userAccountMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
        this.emailService = emailService;
    }

    @Transactional
    public UserAccountDTO registerUser(UserAccountDTO userDTO, String password) {
        // 1. Tạo và chuẩn bị đối tượng UserAccount
        UserAccount newUser = new UserAccount();
        String encryptedPassword = passwordEncoder.encode(password);

        newUser.setPassword(encryptedPassword);
        newUser.setName(userDTO.getName());
        // Chuyển email về chữ thường để đảm bảo tính duy nhất
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setPhone(userDTO.getPhone());
        newUser.setRole(userDTO.getRole());
        newUser.setTier(userDTO.getTier());
        newUser.setActivated(Boolean.TRUE);
        newUser.setCreated(Instant.now()); // Nên set thời gian ngay trong service
        newUser.setUpdated(Instant.now());

        // 2. Lưu UserAccount TRƯỚC để lấy ID
        userAccountRepository.save(newUser);
        log.debug("Saved User: {}", newUser);

        // 3. Tạo và chuẩn bị đối tượng Cart
        Cart cart = new Cart();
        cart.setUser(newUser); // Thiết lập mối quan hệ từ Cart -> User
        cart.setCreatedAt(Instant.now());
        cart.setUpdatedAt(Instant.now());

        // (Optional, nhưng là Best Practice)
        // Nếu bạn có trường `cart` trong entity `UserAccount`, hãy set nó ở đây
        // newUser.setCart(cart); // Thiết lập mối quan hệ ngược lại từ User -> Cart

        // 4. Lưu Cart SAU
        cartRepository.save(cart);
        log.debug("Created Cart for User: {}", newUser.getEmail());

        return userAccountMapper.toDto(newUser);
    }

    @Transactional(readOnly = true)
    public Optional<UserAccountDTO> getProfile() {
        log.debug("Request to get UserAccount");
        return SecurityUtils.getCurrentUserLogin()
                .flatMap(userAccountRepository::findOneByEmailIgnoreCase) // Tìm User entity trong DB
                .map(userAccountMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<UserAccountDTO> getUserAccounts(Pageable pageable) {
        log.debug("Request to get UserAccounts");
        return userAccountRepository.findAll(pageable).map(userAccountMapper::toDto);
    }

    @Transactional
    public Optional<UserAccountDTO> changeUserStatus(Long id){
        log.debug("Request to change UserAccount status");
        return userAccountRepository
                .findById(id)
                .map(user -> {
                    // Lấy trạng thái hiện tại và đảo ngược nó
                    user.setActivated(!user.getActivated());
                    return user;
                })
                .map(userAccountRepository::save)
                .map(userAccountMapper::toDto);
    }

    @Transactional
    public Optional<UserAccountDTO> changeUserRole(Long id, String role) throws BadRequestException {
        log.debug("Request to change UserAccount role");
        UserAccount user = userAccountRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User Account Not Found"));
        if(role.equalsIgnoreCase("admin")){
            user.setRole(Role.ROLE_ADMIN);
        }
        if(role.equalsIgnoreCase("staff")){
            user.setRole(Role.ROLE_STAFF);
        }
        if(role.equalsIgnoreCase("customer")){
            user.setRole(Role.ROLE_CUSTOMER);
        }
        userAccountRepository.save(user);
        return Optional.of(userAccountMapper.toDto(user));
    }

    @Transactional
    public boolean existedId(Long petId) {
        return userAccountRepository.existsById(petId);
    }

    @Transactional
    public Optional<UserAccountDTO> updateProfile(Long id, UserAccountDTO userDTO) {
        log.debug("Request to update UserAccount profile");
        return userAccountRepository.findById(id).map(existingProfile -> {
            userAccountMapper.partialUpdate(existingProfile, userDTO);
            return existingProfile;
        }).map(userAccountRepository::save).map(userAccountMapper::toDto);
    }

    @Transactional
    public Optional<UserAccountDTO> uploadAvatar(String email, MultipartFile file) {
        log.debug("Request to upload avatar");
        UserAccount user = userAccountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String fileName = fileStorageService.storeFile(file);
        String fileUrl = "http://localhost:8080/images/" + fileName;
        user.setAvatar(fileUrl);
        userAccountRepository.save(user);
        return Optional.of(userAccountMapper.toDto(user));
    }

    public Optional<UserAccountDTO> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userAccountRepository.findOneByResetKey(key)
                .filter(user -> {
                    // Logic kiểm tra hết hạn:
                    return user.getResetDate().isAfter(Instant.now().minusSeconds(900));
                })
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    user.setResetKey(null);
                    user.setResetDate(null);
                    UserAccount updatedUser = userAccountRepository.save(user);
                    return userAccountMapper.toDto(updatedUser);
                });
    }

    public Optional<UserAccountDTO> requestPasswordReset(String mail) {
        log.info("1. Bắt đầu yêu cầu reset pass cho: {}", mail);

        Optional<UserAccount> userOptional = userAccountRepository.findOneByEmailIgnoreCase(mail);

        if (userOptional.isPresent()) {
            UserAccount user = userOptional.get();
            log.info("2. Tìm thấy user id: {}, isActivated: {}", user.getId(), user.getActivated());

            if (!user.getActivated()) {
                log.warn("!!! User chưa kích hoạt. Dừng xử lý.");
                return Optional.empty();
            }

            // Logic update
            user.setResetKey(UUID.randomUUID().toString());
            user.setResetDate(Instant.now());
            userAccountRepository.save(user);
            log.info("3. Đã save Reset Key vào DB: {}", user.getResetKey());

            // Logic gửi mail
            try {
                log.info("4. Chuẩn bị gửi mail...");
                emailService.sendForgotPasswordEmail(user.getEmail(), user.getName(), user.getResetKey());
                log.info("5. Gửi mail thành công!");
            } catch (Exception e) {
                log.error("!!! Lỗi khi gửi mail: ", e);
            }

            return Optional.of(userAccountMapper.toDto(user));
        } else {
            log.warn("!!! Không tìm thấy email trong DB");
        }

        return Optional.empty();
    }
}
