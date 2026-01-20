package org.xumin.petcare.web.rest;

import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xumin.petcare.service.*;
import org.xumin.petcare.service.dto.AppServiceDTO;
import org.xumin.petcare.service.dto.ProductDTO;
import org.xumin.petcare.service.dto.UserAccountDTO;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
//@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    private final Logger log = LoggerFactory.getLogger(AdminController.class);
    private final ProductService productService;
    private final UserAccountService userAccountService;
    private final OrderService orderService;
    private final PetService petService;
    private final AppServiceService appService;

    @Autowired
    public AdminController(ProductService productService, UserAccountService userAccountService, OrderService orderService, PetService petService, AppServiceService appService) {
        this.productService = productService;
        this.userAccountService = userAccountService;
        this.orderService = orderService;
        this.petService = petService;
        this.appService = appService;
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserAccountDTO>> getAllUsers(@ParameterObject Pageable pageable) {
        log.debug("REST request to get users pageable : {}", pageable);
        Page<UserAccountDTO> users = userAccountService.getUserAccounts(pageable);
        return ResponseEntity.ok().body(users);
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserAccountDTO> changeUserStatus(@PathVariable Long id) throws BadRequestException {
        log.debug("REST request to toggle user status for id: {}", id);
        if (!userAccountService.existedId(id)) {
            throw new BadRequestException("User not found with the provided id");
        }
        Optional<UserAccountDTO> result = userAccountService.changeUserStatus(id);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserAccountDTO> changeUserRole(@PathVariable Long id, @RequestParam String role) throws BadRequestException {
        log.debug("REST request to change user role for id: {}", id);
        Optional<UserAccountDTO> result = userAccountService.changeUserRole(id, role);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO>> getProducts(@ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Products");
        Page<ProductDTO> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok().body(products);
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) throws BadRequestException, URISyntaxException {
        log.debug("REST request to save Product : {}", productDTO);
        if (productDTO.getId() != null) {
            throw new BadRequestException("A new pet cannot already have an ID id exists");
        }
        ProductDTO result = productService.createProduct(productDTO);
        return ResponseEntity
                .created(new URI("/api/admin/products" + result.getId()))
                .body(result);
    }

    @PatchMapping("/products/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                    @RequestBody ProductDTO productDTO) throws BadRequestException {
        log.debug("REST request to update Product : {}", productDTO);
        if (!productService.existedId(id)) {
            throw new BadRequestException("Entity not found id not found");
        }
        Optional<ProductDTO> result = productService.updateProduct(id, productDTO);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.debug("REST request to delete Product : {}", id);
        productService.deleteProduct(id);
        return ResponseEntity
                .noContent()
                .build();
    }

    @GetMapping("/services")
    public ResponseEntity<Page<AppServiceDTO>> getAppServices(@ParameterObject Pageable pageable) {
        log.debug("REST request to get app service");
        Page<AppServiceDTO> appServices = appService.getAllAppServices(pageable);
        return ResponseEntity.ok().body(appServices);
    }

    @PostMapping("/services")
    public ResponseEntity<AppServiceDTO> createAppService(@RequestBody AppServiceDTO appServiceDTO) throws BadRequestException, URISyntaxException {
        log.debug("REST request to save app service : {}", appServiceDTO);
        if (appServiceDTO.getId() != null) {
            throw new BadRequestException("A new pet cannot already have an ID id exists");
        }
        AppServiceDTO result = appService.createAppService(appServiceDTO);
        return ResponseEntity
                .created(new URI("/api/admin/services" + result.getId()))
                .body(result);
    }

    @PatchMapping("/services/{id}")
    public ResponseEntity<AppServiceDTO> updateAppService(@PathVariable Long id,
                                                          @RequestBody AppServiceDTO appServiceDTO) throws BadRequestException {
        log.debug("REST request to update app service : {}", appServiceDTO);
        if (!appService.existedId(id)) {
            throw new BadRequestException("Entity not found id not found");
        }
        Optional<AppServiceDTO> result = appService.updateAppService(id, appServiceDTO);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteAppService(@PathVariable Long id) {
        log.debug("REST request to delete app service : {}", id);
        appService.deleteAppService(id);
        return ResponseEntity
                .noContent()
                .build();
    }
}
