package com.kirana.controller;

import com.kirana.dto.CartDTO;
import com.kirana.dto.CartRequest;
import com.kirana.security.UserPrincipal;
import com.kirana.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new IllegalStateException("User authentication is not in the expected state.");
        }
        return ((UserPrincipal) authentication.getPrincipal()).getId();
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(cartService.getCartDtoByUser(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(Authentication authentication, @RequestBody CartRequest request) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(cartService.addToCart(userId, request.getProductId(), request.getQuantity()));
    }

    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateCartItem(Authentication authentication, @RequestBody CartRequest request) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(cartService.updateCartItem(userId, request.getProductId(), request.getQuantity()));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<CartDTO> removeFromCart(Authentication authentication, @RequestBody CartRequest request) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(cartService.removeFromCart(userId, request.getProductId()));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}
