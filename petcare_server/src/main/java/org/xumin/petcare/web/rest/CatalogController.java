package org.xumin.petcare.web.rest;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.xumin.petcare.domain.AppService;
import org.xumin.petcare.service.AppServiceService;
import org.xumin.petcare.service.CouponService;
import org.xumin.petcare.service.ProductService;
import org.xumin.petcare.service.dto.AppServiceDTO;
import org.xumin.petcare.service.dto.CouponDTO;
import org.xumin.petcare.service.dto.ProductDTO;
import java.util.Optional;

@RestController
@RequestMapping("/api/catalog")
//@CrossOrigin(origins = "http://localhost:3000")
public class CatalogController {
    private final Logger log = LoggerFactory.getLogger(CatalogController.class);
    private final ProductService productService;
    private final CouponService couponService;
    private final AppServiceService appService;

    @Autowired
    public CatalogController(ProductService productService, CouponService couponService, AppServiceService appService) {
        this.productService = productService;
        this.couponService = couponService;
        this.appService = appService;
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO>> products(@ParameterObject Pageable pageable){
        log.debug("REST request to get all products");
        Page<ProductDTO> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok().body(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> product(@PathVariable Long id){
        log.debug("REST request to get Product : {}", id);
        Optional<ProductDTO> productDTO = productService.getProductById(id);
        return productDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/services")
    public ResponseEntity<Page<AppServiceDTO>> services(@ParameterObject Pageable pageable){
        log.debug("REST request to get all services");
        Page<AppServiceDTO> services = appService.getAllAppServices(pageable);
        return ResponseEntity.ok().body(services);
    }

    // Coupons verify for product/cart preview
    @GetMapping("/coupons/{code}/verify")
    public ResponseEntity<CouponDTO> verify(@PathVariable String code){
        return null;
    }

}
