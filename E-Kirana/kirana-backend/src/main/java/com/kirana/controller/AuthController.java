package com.kirana.controller;

import com.kirana.model.User;
import com.kirana.repository.UserRepository;
import com.kirana.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (name == null || name.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Name, email and password are required");
            return ResponseEntity.badRequest().body(error);
        }

        if (userRepository.findByEmail(email).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is already registered");
            return ResponseEntity.badRequest().body(error);
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        // Determine role: accept optional role from request, normalize and validate
        String requestedRole = request.getOrDefault("role", "USER");
        String normalizedRole = requestedRole == null ? "USER" : requestedRole.trim().toUpperCase();
        if (!normalizedRole.equals("ADMIN") && !normalizedRole.equals("USER")) {
            normalizedRole = "USER"; // fallback to USER for any invalid role
        }
        user.setRole(normalizedRole);

        userRepository.save(user);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Registration successful");
        return ResponseEntity.status(201).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty() || !passwordEncoder.matches(password, optUser.get().getPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            return ResponseEntity.status(401).body(error);
        }
        User user = optUser.get();
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("id", user.getId());
        safeUser.put("email", user.getEmail());
        safeUser.put("role", user.getRole());
        safeUser.put("name", user.getName());
        response.put("user", safeUser);
        return ResponseEntity.ok(response);
    }
}
