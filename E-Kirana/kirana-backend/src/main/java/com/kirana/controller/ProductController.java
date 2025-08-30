package com.kirana.controller;

import com.kirana.model.Product;
import com.kirana.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    // NEW: return featured products for homepage carousel (defensive - catches errors and returns empty list on failure)
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        try {
            List<Product> featured = productService.getFeaturedProducts();
            return ResponseEntity.ok(featured);
        } catch (Exception ex) {
            // Log full stacktrace and return empty list to avoid 500 on frontend
            log.error("Failed to load featured products", ex);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    // NEW: return rating info for a product
    @GetMapping("/{id}/rating")
    public ResponseEntity<Map<String, Object>> getProductRating(@PathVariable Long id) {
        Product p = productService.getProductById(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of(
                "rating", p.getRating(),
                "reviewsCount", p.getReviewsCount()
        ));
    }

    /**
     * The main endpoint for listing products.
     * Supports pagination, sorting, and filtering by name and/or category.
     */
    @GetMapping
    public ResponseEntity<Page<Product>> listProducts(
            @org.springframework.data.web.PageableDefault(size = 12, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category) {
        try {
            Page<Product> page = productService.search(name, category, pageable);
            return ResponseEntity.ok(page);
        } catch (Exception ex) {
            log.error("Error listing products", ex);
            return ResponseEntity.ok(Page.empty());
        }
    }

    /**
     * A new endpoint to get a simple list of all unique category names.
     * The frontend will use this to build the category filter sidebar.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }


    // --- Other Admin & Specific Product Endpoints ---

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.addProduct(product));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product updated = productService.updateProduct(id, product);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.ok("Product deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestParam int stock) {
        return ResponseEntity.ok(productService.updateStock(id, stock));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts(@RequestParam(defaultValue = "5") int threshold) {
        return ResponseEntity.ok(productService.getLowStockProducts(threshold));
    }
}
