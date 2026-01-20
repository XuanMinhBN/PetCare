package org.xumin.petcare.service.mapper;

import org.mapstruct.Mapper;
import org.xumin.petcare.domain.Product;
import org.xumin.petcare.service.dto.ProductDTO;

@Mapper(componentModel = "spring", uses = {})
public interface ProductMapper extends EntityMapper<ProductDTO, Product>{
}
