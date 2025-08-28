package com.kirana.mapper;

import com.kirana.dto.CartDTO;
import com.kirana.dto.CartItemDTO;
import com.kirana.dto.ProductDTO;
import com.kirana.model.Cart;
import com.kirana.model.CartItem;
import com.kirana.model.Product;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CartMapper {

    public ProductDTO toProductDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }

    public CartItemDTO toCartItemDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getPrice());
        dto.setProduct(toProductDTO(cartItem.getProduct()));
        return dto;
    }

    public CartDTO toCartDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setItems(cart.getItems().stream()
                .map(this::toCartItemDTO)
                .collect(Collectors.toList()));
        return dto;
    }
}
