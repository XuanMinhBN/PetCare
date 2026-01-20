package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.Address;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.repository.AddressRepository;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.AddressDTO;
import org.xumin.petcare.service.mapper.AddressMapper;

import java.util.Optional;

@Service
@Transactional
public class AddressService {
    private final Logger log = LoggerFactory.getLogger(AddressService.class);
    private final AddressRepository addressRepository;
    private final UserAccountRepository accountRepository;
    private final AddressMapper addressMapper;

    @Autowired
    public AddressService(AddressRepository addressRepository, UserAccountRepository accountRepository, AddressMapper addressMapper) {
        this.addressRepository = addressRepository;
        this.accountRepository = accountRepository;
        this.addressMapper = addressMapper;
    }

    @Transactional(readOnly = true)
    public Page<AddressDTO> getAddressesByUser(Pageable pageable) {
        log.debug("Request to get all Addresses");
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return accountRepository.findOneByEmailIgnoreCase(username)
                .map(userAccount -> {
                    // Nếu user tồn tại, dùng ID để tìm địa chỉ
                    return addressRepository.findAddressesByUserId(userAccount.getId(), pageable)
                            .map(addressMapper::toDto);
                })
                // Nếu không tìm thấy user, trả về một trang rỗng
                .orElse(Page.empty(pageable));
    }

    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO) {
        log.debug("Request to save Address for current user: {}", addressDTO);
        // 1. Lấy username của người dùng đang đăng nhập
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        // 2. Tìm User entity tương ứng
        UserAccount currentUser = accountRepository.findOneByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
        // 3. Chuyển DTO thành Entity
        Address address = addressMapper.toEntity(addressDTO);
        // 4. Gán người dùng hiện tại vào địa chỉ mới (BƯỚC QUAN TRỌNG NHẤT)
        address.setUser(currentUser);
        // 5. Lưu vào cơ sở dữ liệu
        Address result = addressRepository.save(address);
        // 6. Trả về DTO
        return addressMapper.toDto(result);
    }

    @Transactional
    public Optional<AddressDTO> updateAddress(Long id, AddressDTO addressDTO) {
        log.debug("Request to update Address : {}", addressDTO);
        return addressRepository
                .findById(id)
                .map(existingAddress -> {
                    addressMapper.partialUpdate(existingAddress, addressDTO);
                    return existingAddress;
                })
                .map(addressRepository::save)
                .map(addressMapper::toDto);
    }

    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Address : {}", id);
        addressRepository.deleteById(id);
    }

    @Transactional
    public boolean existedId(Long addressId) {
        return addressRepository.existsById(addressId);
    }
}
