package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.Pet;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.repository.PetRepository;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.PetDTO;
import org.xumin.petcare.service.mapper.PetMapper;

import java.util.Optional;

@Service
@Transactional
public class PetService {
    private final Logger log = LoggerFactory.getLogger(PetService.class);
    private final PetRepository petRepository;
    private final UserAccountRepository accountRepository;
    private final PetMapper petMapper;

    @Autowired
    public PetService(PetRepository petRepository, UserAccountRepository accountRepository, PetMapper petMapper) {
        this.petRepository = petRepository;
        this.accountRepository = accountRepository;
        this.petMapper = petMapper;
    }

    @Transactional(readOnly = true)
    public Page<PetDTO> getPetCurrentUser(Pageable pageable) {
        log.debug("Request getPetCurrentUser");
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return accountRepository.findOneByEmailIgnoreCase(username)
                .map(userAccount -> {
                    // Nếu user tồn tại, dùng ID để tìm địa chỉ
                    return petRepository.getPetsByUserId(userAccount.getId(), pageable)
                            .map(petMapper::toDto);
                })
                // Nếu không tìm thấy user, trả về một trang rỗng
                .orElse(Page.empty(pageable));
    }

    @Transactional(readOnly = true)
    public Optional<PetDTO> getPetById(Long id) {
        log.debug("Request getPetById");
        return petRepository.findById(id).map(petMapper::toDto);
    }

    @Transactional
    public PetDTO savePet(PetDTO petDTO) {
        log.debug("Request to savePet: {}", petDTO);
        // 1. Lấy username của người dùng đang đăng nhập
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        // 2. Tìm User entity tương ứng
        UserAccount currentUser = accountRepository.findOneByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
        // 3. Chuyển DTO thành Entity
        Pet pet = petMapper.toEntity(petDTO);
        // 4. Gán người dùng hiện tại vào địa chỉ mới (BƯỚC QUAN TRỌNG NHẤT)
        pet.setUser(currentUser);
        // 5. Lưu vào cơ sở dữ liệu
        Pet result = petRepository.save(pet);
        // 6. Trả về DTO
        return petMapper.toDto(result);
    }

    @Transactional
    public Optional<PetDTO> updatePet(Long id, PetDTO petDTO) {
        log.debug("Request to partially update Pet : {}", petDTO);
        return petRepository
                .findById(id)
                .map(existingPet -> {
                    petMapper.partialUpdate(existingPet, petDTO);
                    return existingPet;
                })
                .map(petRepository::save)
                .map(petMapper::toDto);
    }

    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Pet : {}", id);
        petRepository.deleteById(id);
    }

    @Transactional
    public boolean existedId(Long petId) {
        return petRepository.existsById(petId);
    }
}
