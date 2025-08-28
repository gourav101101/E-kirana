package com.kirana.service.implementation;

import com.kirana.dto.CartDTO;
import com.kirana.mapper.CartMapper;
import com.kirana.model.*;
import com.kirana.repository.CartRepository;
import com.kirana.repository.ProductRepository;
import com.kirana.repository.UserRepository;
import com.kirana.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartMapper cartMapper;

    // This is the internal method to get the raw Cart entity
    @Override
    @Transactional(readOnly = true)
    public Cart getCartEntityByUser(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    // This is the public method for the controller, returning the safe DTO
    @Override
    @Transactional(readOnly = true)
    public CartDTO getCartDtoByUser(Long userId) {
        return cartMapper.toCartDTO(getCartEntityByUser(userId));
    }

    @Override
    @Transactional
    public CartDTO addToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartEntityByUser(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setPrice(item.getQuantity() * product.getPrice());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setPrice(product.getPrice() * quantity);
            cart.getItems().add(newItem);
        }

        recalculateTotalPrice(cart);
        Cart updatedCart = cartRepository.save(cart);
        return cartMapper.toCartDTO(updatedCart);
    }

    @Override
    @Transactional
    public CartDTO updateCartItem(Long userId, Long productId, int quantity) {
        Cart cart = getCartEntityByUser(userId);
        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setPrice(quantity * item.getProduct().getPrice());
                });

        recalculateTotalPrice(cart);
        Cart updatedCart = cartRepository.save(cart);
        return cartMapper.toCartDTO(updatedCart);
    }

    @Override
    @Transactional
    public CartDTO removeFromCart(Long userId, Long productId) {
        Cart cart = getCartEntityByUser(userId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        recalculateTotalPrice(cart);
        Cart updatedCart = cartRepository.save(cart);
        return cartMapper.toCartDTO(updatedCart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartEntityByUser(userId);
        cart.getItems().clear();
        recalculateTotalPrice(cart);
        cartRepository.save(cart);
    }

    private void recalculateTotalPrice(Cart cart) {
        double totalPrice = cart.getItems().stream()
                .mapToDouble(CartItem::getPrice)
                .sum();
        cart.setTotalPrice(totalPrice);
    }
}
