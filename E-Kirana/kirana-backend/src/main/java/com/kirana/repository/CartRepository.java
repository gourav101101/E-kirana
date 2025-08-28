package com.kirana.repository;

import com.kirana.model.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    /**
     * Finds a cart by user ID, using an EntityGraph to eagerly fetch the cart items and their products.
     * This prevents the LazyInitializationException during JSON serialization.
     * @param userId The ID of the user.
     * @return An Optional containing the cart if found.
     */
    @EntityGraph(value = "cart-with-items-and-products")
    Optional<Cart> findByUserId(Long userId);
}
