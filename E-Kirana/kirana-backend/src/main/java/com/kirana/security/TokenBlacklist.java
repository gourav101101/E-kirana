package com.kirana.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Very simple in-memory blacklist with expiry timestamps (epoch seconds).
 */
@Component
public class TokenBlacklist {

    private final Map<String, Long> revoked = new ConcurrentHashMap<>();

    // Add token into blacklist until its expiry
    public void revoke(String token, long expiresAtEpochSeconds) {
        revoked.put(token, expiresAtEpochSeconds);
    }

    // Check if token is revoked
    public boolean isRevoked(String token) {
        Long exp = revoked.get(token);
        if (exp == null) return false;
        if (Instant.now().getEpochSecond() >= exp) {
            revoked.remove(token); // cleanup expired entry
            return false;
        }
        return true;
    }

    // Periodic cleanup (every 5 minutes)
    @Scheduled(fixedDelay = 300_000)
    public void cleanup() {
        long now = Instant.now().getEpochSecond();
        revoked.entrySet().removeIf(e -> e.getValue() <= now);
    }
}
