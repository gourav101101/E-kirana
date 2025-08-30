package com.kirana.bootstrap;

import com.kirana.model.Product;
import com.kirana.model.User;
import com.kirana.repository.ProductRepository;
import com.kirana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            seedProducts();
        }
        seedAdminUserIfMissing();
    }

    private void seedProducts() {
        List<Product> demoProducts = Arrays.asList(
            new Product("Aashirvaad Atta", 220.00, 150, "Staples", "1kg pack of whole wheat flour for soft rotis.", "https://m.media-amazon.com/images/I/9104JpXbv6L._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Tata Salt", 25.00, 300, "Staples", "1kg pack of iodized salt.", "https://m.media-amazon.com/images/I/51F3xaYIXnL._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Amul Butter", 52.00, 100, "Dairy", "100g pack of classic Amul pasteurized butter.", "https://m.media-amazon.com/images/I/51KrxEKN58L._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Parle-G Biscuits", 10.00, 500, "Snacks", "The original gluco-biscuit, a favorite for all ages.", "https://m.media-amazon.com/images/I/71bufOt9zAL._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Maggi 2-Minute Noodles", 14.00, 400, "Snacks", "Instant noodles masala flavour, ready in 2 minutes.", "https://m.media-amazon.com/images/I/81kD9TwLGaS._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Saffola Gold Oil", 180.00, 80, "Staples", "1 litre blended cooking oil for a healthy heart.", "https://m.media-amazon.com/images/I/61GKJwEDggL._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Red Label Tea", 150.00, 120, "Beverages", "250g pack of strong and aromatic black tea.", "https://m.media-amazon.com/images/I/51kjP3W+GjL._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Dettol Antiseptic Liquid", 110.00, 90, "Household", "500ml bottle of effective antiseptic disinfectant.", "https://m.media-amazon.com/images/I/51cVv+lYEvL._CR,,,_QL70_SL300_.jpg"),
            new Product("Surf Excel Detergent", 125.00, 100, "Household", "1kg pack of detergent powder for tough stain removal.", "https://m.media-amazon.com/images/I/61k7LBJiN7L._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Colgate Toothpaste", 95.00, 150, "Personal Care", "200g tube of Colgate MaxFresh toothpaste.", "https://m.media-amazon.com/images/I/51pzdHIeASL._SX300_SY300_QL70_FMwebp_.jpg"),
            new Product("Toor Dal", 140.00, 200, "Staples", "1kg pack of unpolished toor dal, rich in protein.", "https://m.media-amazon.com/images/I/71hUZ3AgDGL._AC_UL480_FMwebp_QL65_.jpg"),
            new Product("Onions", 40.00, 250, "Vegetables", "1kg of fresh, high-quality onions.", "https://m.media-amazon.com/images/I/41lAEExTwBL._SX300_SY300_QL70_FMwebp_.jpg")
        );

        productRepository.saveAll(demoProducts);
        System.out.println("Database seeded with " + demoProducts.size() + " Indian Kirana products.");
        seedAdditionalProducts();
    }

    private void seedAdditionalProducts() {
        try {
            long count = productRepository.count();
            if (count > 0) {
                System.out.println("Database already contains products (count: " + count + "), skipping additional seeding.");
                return;
            }

            Product p1 = new Product("Test Mango Pack", 249.99, 50, "Fruits", "Fresh mangoes, 1kg pack.", "https://via.placeholder.com/600x400.png?text=Mango");
            p1.setOldPrice(299.99);
            p1.setFeatured(true);
            p1.setBestseller(true);
            p1.setIsNew(true);
            p1.setRating(4.6);
            p1.setReviewsCount(12);
            p1.setImages(List.of("https://via.placeholder.com/300x300.png?text=Mango1","https://via.placeholder.com/300x300.png?text=Mango2"));

            Product p2 = new Product("Organic Spinach", 49.99, 120, "Vegetables", "Fresh organic spinach bunch.", "https://via.placeholder.com/600x400.png?text=Spinach");
            p2.setFeatured(true);
            p2.setRating(4.3);
            p2.setReviewsCount(5);
            p2.setImages(List.of("https://via.placeholder.com/300x300.png?text=Spinach1"));

            Product p3 = new Product("Cow Milk 1L", 59.99, 80, "Dairy", "Full cream milk 1 liter.", "https://via.placeholder.com/600x400.png?text=Milk");
            p3.setImages(List.of("https://via.placeholder.com/300x300.png?text=Milk1"));

            productRepository.saveAll(List.of(p1, p2, p3));
            System.out.println("Seeded additional sample products.");
        } catch (Exception ex) {
            System.err.println("Failed to seed additional products: " + ex.getMessage());
        }
    }

    private void seedAdminUserIfMissing() {
        // Create a default admin if none exists
        boolean hasAdmin = userRepository.findAll().stream().anyMatch(u -> "ADMIN".equalsIgnoreCase(u.getRole()));
        if (!hasAdmin) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@kirana.test");
            admin.setPassword(passwordEncoder.encode(   "123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded default admin user: admin@kirana.test / Admin@123");
        }
    }
}
