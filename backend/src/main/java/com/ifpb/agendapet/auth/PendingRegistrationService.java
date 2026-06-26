package com.ifpb.agendapet.auth;

import com.ifpb.agendapet.auth.dto.RegisterRequestDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PendingRegistrationService {

    public record PendingRegistration(RegisterRequestDTO dto, String pin, LocalDateTime expiration) {}

    // In-memory cache: Key is email
    private final Map<String, PendingRegistration> cache = new ConcurrentHashMap<>();

    public void addPendingRegistration(String email, RegisterRequestDTO dto, String pin) {
        PendingRegistration pending = new PendingRegistration(dto, pin, LocalDateTime.now().plusMinutes(15));
        cache.put(email, pending);
    }

    public PendingRegistration getPendingRegistration(String email) {
        return cache.get(email);
    }

    public void removePendingRegistration(String email) {
        cache.remove(email);
    }
}
