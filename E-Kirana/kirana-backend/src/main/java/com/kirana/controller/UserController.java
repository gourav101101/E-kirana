package com.kirana.controller;

import com.kirana.model.User;
import com.kirana.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ---------- IMPORTANT: Keep this BEFORE "/{id}" to avoid 'me' -> Long conversion ----------
    // ✅ Current user's profile (requires JWT)
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "UNAUTHORIZED", "message", "Login required"));
        }
        Optional<User> opt = userRepository.findByEmail(auth.getName());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "NOT_FOUND", "message", "User not found"));
        }
        User u = opt.get();
        return ResponseEntity.ok(new ProfileDTO(u.getId(), u.getName(), u.getEmail(),
                u.getRole() == null ? null : String.valueOf(u.getRole())));
    }

    // ✅ Self update (name/email/password) — requires JWT
    @PutMapping("/me")
    public ResponseEntity<?> updateMe(Authentication auth, @Valid @RequestBody UpdateMeDTO body) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "UNAUTHORIZED", "message", "Login required"));
        }
        Optional<User> opt = userRepository.findByEmail(auth.getName());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "NOT_FOUND", "message", "User not found"));
        }

        User u = opt.get();
        if (body.name != null) u.setName(body.name);
        if (body.email != null) u.setEmail(body.email);
        if (body.password != null && !body.password.isBlank()) {
            u.setPassword(passwordEncoder.encode(body.password));
        }
        userRepository.save(u);

        return ResponseEntity.ok(new ProfileDTO(u.getId(), u.getName(), u.getEmail(),
                u.getRole() == null ? null : String.valueOf(u.getRole())));
    }

    // ---------- Other user endpoints (keep AFTER "/me") ----------

    // ✅ Get user by ID (authenticated; admin listing is under /admin/users)
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(
                        new ProfileDTO(u.getId(), u.getName(), u.getEmail(),
                                u.getRole() == null ? null : String.valueOf(u.getRole()))
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "NOT_FOUND", "message", "User not found with ID: " + id)));
    }

    // ✅ Get user by Email (no clash with /{id} since path starts with fixed segment)
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(
                        new ProfileDTO(u.getId(), u.getName(), u.getEmail(),
                                u.getRole() == null ? null : String.valueOf(u.getRole()))
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "NOT_FOUND", "message", "User not found with email: " + email)));
    }

    // ---------- DTOs ----------
    public static class ProfileDTO {
        public Long id;
        public String name;
        public String email;
        public String role;
        public ProfileDTO(Long id, String name, String email, String role) {
            this.id = id; this.name = name; this.email = email; this.role = role;
        }
    }

    public static class UpdateMeDTO {
        public String name;
        public String email;
        public String password;
    }
}
