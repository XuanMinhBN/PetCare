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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.xumin.petcare.service.AddressService;
import org.xumin.petcare.service.NotificationService;
import org.xumin.petcare.service.PetService;
import org.xumin.petcare.service.UserAccountService;
import org.xumin.petcare.service.dto.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
//@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {
    private final Logger log = LoggerFactory.getLogger(UserProfileController.class);
    private final UserAccountService userAccountService;
    private final AddressService addressService;
    private final PetService petService;
    private final NotificationService notificationService;

    @Autowired
    public UserProfileController(UserAccountService userAccountService, AddressService addressService, PetService petService, NotificationService notificationService) {
        this.userAccountService = userAccountService;
        this.addressService = addressService;
        this.petService = petService;
        this.notificationService = notificationService;
    }

    // current user
    @GetMapping("/me")
    public ResponseEntity<UserAccountDTO> me(){
        log.debug("REST request to me ");
        Optional<UserAccountDTO> user = userAccountService.getProfile();
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserAccountDTO> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UserAccountDTO userAccountDTO) throws BadRequestException {
        log.debug("REST request to update profile ");
        Optional<UserAccountDTO> user = userAccountService.getProfile();
        if(user.isEmpty()){
            throw new BadRequestException("Entity not found id not found");
        }
        Optional<UserAccountDTO> result = userAccountService.updateProfile(id, userAccountDTO);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/avatar")
    public ResponseEntity<UserAccountDTO> uploadAvatar(@RequestParam("avatar") MultipartFile avatar, Authentication authentication) throws BadRequestException {
        log.debug("REST request to upload avatar ");
        Optional<UserAccountDTO> user = userAccountService.getProfile();
        if(user.isEmpty()){
            throw new BadRequestException("Entity not found id not found");
        }
        Optional<UserAccountDTO> result = userAccountService.uploadAvatar(authentication.getName() ,avatar);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // addresses
    @GetMapping("/addresses")
    public ResponseEntity<Page<AddressDTO>> listAddr(@ParameterObject Pageable pageable){
        log.debug("REST request to list addresses");
        Page<AddressDTO> addresses = addressService.getAddressesByUser(pageable);
        return ResponseEntity.ok().body(addresses);
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddr(@Valid @RequestBody AddressDTO dto) throws URISyntaxException {
        log.debug("REST request to save Address : {}", dto);
        AddressDTO result = addressService.createAddress(dto);
        return ResponseEntity
                .created(new URI("/api/profile/addresses/" + result.getId()))
                .body(result);
    }

    @PatchMapping("/addresses/{id}")
    public ResponseEntity<AddressDTO> updateAddr(@PathVariable Long id,
                                                 @Valid @RequestBody AddressDTO addressDTO) throws BadRequestException {
        log.debug("REST request to update Address : {}, {}", id, addressDTO);
        if (!addressService.existedId(id)) {
            throw new BadRequestException("Entity not found id not found");
        }
        Optional<AddressDTO> result = addressService.updateAddress(id, addressDTO);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> delAddr(@PathVariable Long id){
        log.debug("REST request to delete Address : {}", id);
        addressService.delete(id);
        return ResponseEntity
                .noContent()
                .build();
    }

    // pets of user
    @GetMapping("/pets")
    public ResponseEntity<Page<PetDTO>> myPets(@ParameterObject Pageable pageable){
        log.debug("REST request to get user pets");
        Page<PetDTO> pets = petService.getPetCurrentUser(pageable);
        return ResponseEntity.ok().body(pets);
    }

    @GetMapping("/pets/{id}")
    public ResponseEntity<PetDTO> myPet(@PathVariable Long id){
        log.debug("REST request to get user pet");
        Optional<PetDTO> pet = petService.getPetById(id);
        return ResponseEntity.ok().body(pet.orElse(null));
    }

    @PostMapping("/pets")
    public ResponseEntity<PetDTO> createPet(@RequestBody PetDTO petDTO) throws BadRequestException, URISyntaxException {
        log.debug("REST request to save Pet : {}", petDTO);
        if (petDTO.getId() != null) {
            throw new BadRequestException("A new pet cannot already have an ID id exists");
        }
        PetDTO result = petService.savePet(petDTO);
        return ResponseEntity
                .created(new URI("/api/profile/pets/" + result.getId()))
                .body(result);
    }

    @PatchMapping("/pets/{id}")
    public ResponseEntity<PetDTO> updatePet(@PathVariable Long id,
                                            @Valid @RequestBody PetDTO petDTO) throws BadRequestException {
        log.debug("REST request to update Pet : {}, {}", id, petDTO);
        if (!petService.existedId(id)) {
            throw new BadRequestException("Entity not found id not found");
        }
        Optional<PetDTO> result = petService.updatePet(id, petDTO);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Void> delPet(@PathVariable Long id){
        log.debug("REST request to delete Pet : {}", id);
        petService.delete(id);
        return ResponseEntity
                .noContent()
                .build();
    }

    // notifications
    @GetMapping("/notifications")
    public ResponseEntity<Page<NotificationDTO>> noti(@ParameterObject Pageable pageable){
        log.debug("REST request to get user notifications");
        Page<NotificationDTO> notifications = notificationService.getCurrentUserNotifications(pageable);
        return ResponseEntity.ok().body(notifications);
    }

    @PatchMapping("/notifications/{id}/seen")
    public ResponseEntity<NotificationDTO> seen(@PathVariable Long id,
                                                @Valid @RequestBody NotificationDTO notificationDTO) throws BadRequestException {
        log.debug("REST request to save Notification : {}", id);
        if (!notificationService.existedId(id)){
            throw new BadRequestException("Entity not found");
        }
        Optional<NotificationDTO> result = notificationService.updateNotification(id, notificationDTO);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
