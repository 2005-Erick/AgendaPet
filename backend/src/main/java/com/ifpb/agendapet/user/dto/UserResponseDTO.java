package com.ifpb.agendapet.user.dto;

import com.ifpb.agendapet.role.Role;
import com.ifpb.agendapet.shared.enums.GenderEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record UserResponseDTO(UUID id, String name, String email, String avatarUrl, GenderEnum gender, LocalDate birthday, Set<Role> roles, LocalDateTime created_at) {
}
