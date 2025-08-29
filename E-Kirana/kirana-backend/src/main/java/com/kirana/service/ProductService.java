package com.kirana.service;

import com.kirana.model.Product;
import com.kirana.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * The single, robust method for searching and filtering products with pagination.
     * This is the only method that should be used for listing products on the frontend.
     */
    public Page<Product> search(String name, String category, Pageable pageable) {
        boolean hasName = StringUtils.hasText(name);
        boolean hasCategory = StringUtils.hasText(category);

        if (hasName && hasCategory) {
            return productRepository.findByCategoryIgnoreCaseAndNameContainingIgnoreCase(category, name, pageable);
        } else if (hasName) {
            return productRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (hasCategory) {
            return productRepository.findByCategoryIgnoreCase(category, pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }

    /**
     * Retrieves a list of all unique product categories for building the filter UI.
     */
    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    public List<Product> getAllCategoriesList() {
        // placeholder if needed
        return productRepository.findAll();
    }

    // NEW: return featured products for the homepage carousel
    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueOrderByIdDesc();
    }

    // --- Standard CRUD and Utility Methods ---

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            product.setCategory(updatedProduct.getCategory());
            product.setDescription(updatedProduct.getDescription());
            product.setImageUrl(updatedProduct.getImageUrl());
            return productRepository.save(product);
        }).orElse(null);
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Product updateStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        product.setStock(quantity);
        return productRepository.save(product);
    }

    public List<Product> getLowStockProducts(int threshold) {
        return productRepository.findByStockLessThan(threshold);
    }
}
