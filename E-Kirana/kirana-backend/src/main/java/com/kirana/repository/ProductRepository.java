package com.kirana.repository;

import com.kirana.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // --- PAGINATED SEARCH METHODS ---

    // Search by name only
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Search by category only
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    // Search by category and name
    Page<Product> findByCategoryIgnoreCaseAndNameContainingIgnoreCase(String category, String name, Pageable pageable);


    // --- OTHER UTILITY METHODS ---

    // Get all unique category strings for the filter feature
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL AND p.category <> '' ORDER BY p.category ASC")
    List<String> findDistinctCategories();

    // For the low stock report
    List<Product> findByStockLessThan(int threshold);

    // NEW: find featured products (for homepage carousel)
    List<Product> findByFeaturedTrueOrderByIdDesc();

}
