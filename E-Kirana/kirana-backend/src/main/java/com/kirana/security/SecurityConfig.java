package com.kirana.security;

import com.kirana.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    @Autowired
    public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtRequestFilter jwtRequestFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults()) // Apply CORS configuration
            .csrf(AbstractHttpConfigurer::disable) // Modern way to disable CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Ensure statelessness
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                auth.requestMatchers("/auth/**").permitAll();
                // Allow public read-only access to products
                auth.requestMatchers(HttpMethod.GET, "/products/**").permitAll();
                // Secure management endpoints for products to ADMIN only
                auth.requestMatchers(HttpMethod.POST, "/products").hasRole("ADMIN");
                auth.requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN");
                auth.requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN");

                // Orders: customer endpoints (authenticated)
                auth.requestMatchers(HttpMethod.POST, "/orders/create").authenticated();
                auth.requestMatchers(HttpMethod.POST, "/orders/checkout/**").authenticated();
                auth.requestMatchers(HttpMethod.GET, "/orders/my").authenticated();

                // Orders: admin endpoints
                auth.requestMatchers(HttpMethod.GET, "/orders").hasRole("ADMIN");
                auth.requestMatchers(HttpMethod.PUT, "/orders/**/status").hasRole("ADMIN");
                auth.requestMatchers(HttpMethod.DELETE, "/orders/**").hasRole("ADMIN");

                // Secure all admin endpoints
                auth.requestMatchers("/admin/**").hasRole("ADMIN");
                // All other requests need to be authenticated
                auth.anyRequest().authenticated();
            })
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class); // Add our custom filter

        return http.build();
    }
}
