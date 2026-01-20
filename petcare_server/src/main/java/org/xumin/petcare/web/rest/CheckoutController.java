package org.xumin.petcare.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sun.jdi.InvalidTypeException;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xumin.petcare.domain.Order;
import org.xumin.petcare.domain.enumeration.OrderStatus;
import org.xumin.petcare.service.CartItemService;
import org.xumin.petcare.service.CartService;
import org.xumin.petcare.service.OrderCouponService;
import org.xumin.petcare.service.OrderService;
import org.xumin.petcare.service.dto.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/checkout")
//@CrossOrigin(origins = "http://localhost:3000")
public class CheckoutController {
    private final Logger log = LoggerFactory.getLogger(CheckoutController.class);
    private final CartService cartService;
    private final OrderService orderService;
    private final CartItemService cartItemService;
    private final OrderCouponService orderCouponService;

    @Autowired
    public CheckoutController(CartService cartService, OrderService orderService, CartItemService cartItemService, OrderCouponService orderCouponService) {
        this.cartService = cartService;
        this.orderService = orderService;
        this.cartItemService = cartItemService;
        this.orderCouponService = orderCouponService;
    }

    // Cart
    @GetMapping("/cart")
    public ResponseEntity<FullCartViewDTO> getCart(@ParameterObject Pageable pageable){
        log.debug("REST request to get a cart");
        Optional<CartDTO> cartOpt = cartService.getCartCurrentUser();
        if (cartOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        CartDTO cartDTO = cartOpt.get();
        Page<CartItemDTO> cartItemsPage = cartItemService.getItems(cartDTO.getId(), pageable);
        FullCartViewDTO fullCartView = new FullCartViewDTO();
        fullCartView.setId(cartDTO.getId());
        fullCartView.setUpdatedAt(cartDTO.getUpdatedAt());
        fullCartView.setItems(cartItemsPage);
        return ResponseEntity.ok(fullCartView);
    }

    @PostMapping("/cart/items")
    public ResponseEntity<CartItemDTO> addItem(@RequestBody AddItemRequestDTO request) throws URISyntaxException {
        log.debug("REST request to add item");
        CartItemDTO cart = cartItemService.addItemInCart(request.getProductId(), request.getQuantity());
        return ResponseEntity.created(new URI("/api/checkout/cart/items/" + cart.getId()))
                .body(cart);
    }

    @PatchMapping("/cart/items/{id}")
    public ResponseEntity<CartItemDTO> updateItem(@PathVariable Long id,
                                                  @RequestBody UpdateItemRequestDTO request){
        log.debug("REST request to update item");
        Optional<CartItemDTO> updatedItem = cartItemService.updateItemInCart(id, request.getQuantity());
        return updatedItem
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @DeleteMapping("/cart/items/{id}")
    public ResponseEntity<Void> delItem(@PathVariable Long id){
        log.debug("REST request to delete item");
        try {
            cartItemService.deleteItemInCart(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/order/{orderId}/apply-coupon")
    public ResponseEntity<OrderCouponDTO> applyCoupon(@Valid @RequestBody CouponDTO couponDTO,
                                                      @PathVariable Long orderId) throws JsonProcessingException {
        log.debug("REST request to apply coupon");
        Optional<OrderCouponDTO> result = orderCouponService.applyCoupon(orderId, couponDTO.getCode());
        return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    // Orders
    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO) throws BadRequestException, URISyntaxException {
        log.debug("REST request to create order");
        if (orderDTO.getId() != null) {
            throw new BadRequestException("A new appointment cannot already have an ID existed");
        }
        OrderDTO result = orderService.create(orderDTO);
        return ResponseEntity.created(new URI("/api/checkout/orders" + result.getId())).body(result);
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDTO>> myOrders(@ParameterObject Pageable pageable){
        log.debug("REST request to get a page of orders");
        Page<OrderDTO> orders = orderService.getOrdersCurrentUser(pageable);
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDTO> order(@PathVariable Long id){
        log.debug("REST request to get order");
        Optional<OrderDTO> orderDTO = orderService.getOrder(id);
        return ResponseEntity.ok().body(orderDTO.orElse(null));
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long id) throws BadRequestException, InvalidTypeException {
        log.debug("REST request to cancel order");
        OrderDTO result = orderService.cancelOrder(id);
        return ResponseEntity.ok().body(result);
    }

}
