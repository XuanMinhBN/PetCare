package org.xumin.petcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xumin.petcare.domain.Cart;
import org.xumin.petcare.domain.CartItem;
import org.xumin.petcare.domain.Product;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.repository.CartItemRepository;
import org.xumin.petcare.repository.CartRepository;
import org.xumin.petcare.repository.ProductRepository;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.SecurityUtils;
import org.xumin.petcare.service.dto.CartItemDTO;
import org.xumin.petcare.service.mapper.CartItemMapper;

import java.time.Instant;
import java.util.Optional;

@Service
public class CartItemService {
    private final Logger log = LoggerFactory.getLogger(CartItemService.class);
    private final UserAccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final CartItemMapper cartItemMapper;

    @Autowired
    public CartItemService(UserAccountRepository accountRepository, ProductRepository productRepository, CartItemRepository cartItemRepository, CartRepository cartRepository, CartItemMapper cartItemMapper) {
        this.accountRepository = accountRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemMapper = cartItemMapper;
    }

    @Transactional
    public Page<CartItemDTO> getItems(Long cartId, Pageable pageable) {
        log.debug("Request to getItems");
        return cartItemRepository.findCartItemByCartId(cartId, pageable).map(cartItemMapper::toDto);
    }

    @Transactional
    public CartItemDTO addItemInCart(Long productId, Integer quantity){
        log.debug("Request addItemInCart");
        // Lấy user
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        UserAccount userAccount = accountRepository.findOneByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy hoặc tạo mới giỏ hàng
        Cart cart = cartRepository.findCartByUserId(userAccount.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(userAccount);
                    newCart.setCreatedAt(Instant.now());
                    newCart.setUpdatedAt(Instant.now());
                    return cartRepository.save(newCart);
                });

        // Lấy sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Kiểm tra item có trong giỏ chưa
        CartItem cartItem = cartItemRepository
                .findCartItemByCartIdAndProductId(cart.getId(), productId)
                .map(item -> {
                    item.setQty(item.getQty() + quantity);
                    item.setPrice(product.getPrice());
                    item.setUpdatedAt(Instant.now());
                    return item;
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQty(quantity);
                    newItem.setPrice(product.getPrice());
                    newItem.setCreatedAt(Instant.now());
                    newItem.setUpdatedAt(Instant.now());
                    return newItem;
                });

        // Lưu lại item
        CartItem savedItem = cartItemRepository.save(cartItem);

        // Cập nhật thời gian giỏ hàng
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);

        // Trả về DTO
        return cartItemMapper.toDto(savedItem);
    }

    @Transactional
    public Optional<CartItemDTO> updateItemInCart(Long itemId, Integer newQuantity) {
        log.debug("Request to update cart item: item={}, qty={}", itemId, newQuantity);

        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        UserAccount userAccount = accountRepository.findOneByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Kiểm tra giỏ hàng của user
        Cart cart = cartRepository.findCartByUserId(userAccount.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found for user"));

        // Lấy cart item
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Kiểm tra item có thuộc giỏ của user không (tránh update nhầm)
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        // Nếu số lượng mới <= 0 → xóa luôn item
        if (newQuantity == null || newQuantity <= 0) {
            cartItemRepository.delete(cartItem);
            cart.setUpdatedAt(Instant.now());
            cartRepository.save(cart);
            return Optional.empty(); // không trả item nữa vì đã bị xóa
        }

        // Cập nhật số lượng và giá
        cartItem.setQty(newQuantity);
        cartItem.setPrice(cartItem.getProduct().getPrice()); // cập nhật lại theo giá mới nếu cần
        cartItem.setUpdatedAt(Instant.now());

        CartItem savedItem = cartItemRepository.save(cartItem);

        // Cập nhật thời gian giỏ hàng
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);

        // Trả về DTO
        return Optional.of(cartItemMapper.toDto(savedItem));
    }

    @Transactional
    public void deleteItemInCart(Long cartItemId) {
        log.debug("Request to delete cart item: itemId={}", cartItemId);

        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        UserAccount userAccount = accountRepository.findOneByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy item cần xoá
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Kiểm tra quyền sở hữu item
        if (!cartItem.getCart().getUser().getId().equals(userAccount.getId())) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        // Xoá item
        cartItemRepository.delete(cartItem);

        // Cập nhật thời gian giỏ hàng
        Cart cart = cartItem.getCart();
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);

        log.debug("Deleted cart item {} successfully", cartItemId);
    }

}
