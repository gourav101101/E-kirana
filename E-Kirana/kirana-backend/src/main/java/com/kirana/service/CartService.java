package com.kirana.service;

import com.kirana.dto.CartDTO;
import com.kirana.model.Cart;

public interface CartService {

    // Returns DTO for controller
    CartDTO getCartDtoByUser(Long userId);

    // Returns Entity for internal service use (e.g., OrderService)
    Cart getCartEntityByUser(Long userId);

    CartDTO addToCart(Long userId, Long productId, int quantity);

    CartDTO updateCartItem(Long userId, Long productId, int quantity);

    CartDTO removeFromCart(Long userId, Long productId);

    void clearCart(Long userId);
}
