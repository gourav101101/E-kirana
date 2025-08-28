package com.kirana.bootstrap;

import com.kirana.model.User;
import com.kirana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@kirana.com") == null) {
            User admin = new User();
            admin.setEmail("admin@kirana.com");
            admin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded admin user: admin@kirana.com / admin123");
        }
    }
}

