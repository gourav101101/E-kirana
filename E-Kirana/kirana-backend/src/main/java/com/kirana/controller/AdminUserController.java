package com.kirana.controller;

import com.kirana.model.User;
import com.kirana.repository.UserRepository;
import com.kirana.repository.CartRepository;
import com.kirana.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository carts;
    private final OrderRepository orders;

    public AdminUserController(UserRepository users, PasswordEncoder passwordEncoder, CartRepository carts, OrderRepository orders) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.carts = carts;
        this.orders = orders;
    }

    // ✅ List all users (ADMIN)
    @GetMapping
    public ResponseEntity<List<UserSummaryDTO>> list() {
        List<UserSummaryDTO> out = users.findAll()
                .stream().map(UserSummaryDTO::from).toList();
        return ResponseEntity.ok(out);
    }

    // ✅ Get user by id (ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<UserSummaryDTO> get(@PathVariable Long id) {
        return users.findById(id)
                .map(UserSummaryDTO::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Create user (ADMIN)
    @PostMapping
    public ResponseEntity<UserSummaryDTO> create(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String roleRaw = body.getOrDefault("role", "USER");
        String role = roleRaw == null ? "USER" : roleRaw.trim().toUpperCase();
        if (!"ADMIN".equals(role) && !"USER".equals(role)) {
            role = "USER";
        }
        String rawPassword = body.get("password");
        boolean hasProvidedPassword = rawPassword != null && !rawPassword.trim().isEmpty();

        User u = new User();
        u.setName(name);
        u.setEmail(email);
        // Use provided password if present; otherwise set a default one.
        u.setPassword(passwordEncoder.encode(hasProvidedPassword ? rawPassword : "ChangeMe@123"));
        u.setRole(role);
        users.save(u);
        return ResponseEntity.status(201).body(UserSummaryDTO.from(u));
    }

    // ✅ Update user (ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<UserSummaryDTO> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return users.findById(id)
                .map(u -> {
                    if (body.containsKey("name")) u.setName(body.get("name"));
                    if (body.containsKey("email")) u.setEmail(body.get("email"));
                    if (body.containsKey("role")) {
                        String role = body.get("role");
                        String normalized = role == null ? null : role.trim().toUpperCase();
                        if ("ADMIN".equals(normalized) || "USER".equals(normalized)) {
                            u.setRole(normalized);
                        }
                    }
                    if (body.containsKey("password")) {
                        String rawPassword = body.get("password");
                        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
                            u.setPassword(passwordEncoder.encode(rawPassword));
                        }
                    }
                    users.save(u);
                    return ResponseEntity.ok(UserSummaryDTO.from(u));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Delete user (ADMIN, optional)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (users.existsById(id)) {
            // Remove dependent data to avoid FK constraint issues
            carts.findByUserId(id).ifPresent(carts::delete);
            orders.findByUserId(id).forEach(o -> orders.deleteById(o.getId()));
            users.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Lightweight DTO (no password leak)
    public static class UserSummaryDTO {
        public Long id;
        public String name;
        public String email;
        public String role;
        public static UserSummaryDTO from(User u) {
            UserSummaryDTO d = new UserSummaryDTO();
            d.id = u.getId();
            d.name = u.getName();
            d.email = u.getEmail();
            d.role = String.valueOf(u.getRole());
            return d;
        }
    }
}
