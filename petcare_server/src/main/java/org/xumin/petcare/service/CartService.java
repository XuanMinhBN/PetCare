package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.repository.CartRepository;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.CartDTO;
import org.xumin.petcare.service.mapper.CartMapper;

import java.util.Optional;

@Service
@Transactional
public class CartService {
    private final Logger log = LoggerFactory.getLogger(CartService.class);
    private final CartRepository cartRepository;
    private final UserAccountRepository accountRepository;
    private final CartMapper cartMapper;

    @Autowired
    public CartService(CartRepository cartRepository, UserAccountRepository accountRepository, CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.accountRepository = accountRepository;
        this.cartMapper = cartMapper;
    }

    @Transactional(readOnly = true)
    public Optional<CartDTO> getCartCurrentUser(){
        log.debug("Request getCartCurrentUser");
        return SecurityUtils.getCurrentUserLogin()
                .flatMap(accountRepository::findOneByEmailIgnoreCase)
                .flatMap(userAccount -> cartRepository.findCartByUserId(userAccount.getId()))
                .map(cartMapper::toDto);
    }
}
