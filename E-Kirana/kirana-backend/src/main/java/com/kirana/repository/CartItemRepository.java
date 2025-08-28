package com.kirana.repository;

import com.kirana.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

// No custom methods are needed here for now.
// The CartService will handle all operations through the Cart entity, so this repository
// can be a simple interface extending JpaRepository.
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
