package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.repository.ProductRepository;
import org.xumin.petcare.service.dto.ProductDTO;
import org.xumin.petcare.service.mapper.ProductMapper;

import java.util.Optional;

@Service
@Transactional
public class ProductService {
    private final Logger log = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Autowired
    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Transactional
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        log.debug("Request to get all Products");
        return productRepository.findAll(pageable).map(productMapper::toDto);
    }

    @Transactional
    public Optional<ProductDTO> getProductById(Long id) {
        log.debug("Request to get Product : {}", id);
        return productRepository.findById(id).map(productMapper::toDto);
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        log.debug("Request to create Product : {}", productDTO);
        return productMapper.toDto(productRepository.save(productMapper.toEntity(productDTO)));
    }

    @Transactional
    public Optional<ProductDTO> updateProduct(Long id, ProductDTO productDTO) {
        log.debug("Request to update Product : {}", id);
        return productRepository
                .findById(id)
                .map(existingProduct -> {
                    productMapper.partialUpdate(existingProduct, productDTO);
                    return existingProduct;
                })
                .map(productRepository::save)
                .map(productMapper::toDto);
    }

    @Transactional
    public void deleteProduct(Long id) {
        log.debug("Request to delete Product : {}", id);
        productRepository.deleteById(id);
    }

    @Transactional
    public boolean existedId(Long petId) {
        return productRepository.existsById(petId);
    }
}
