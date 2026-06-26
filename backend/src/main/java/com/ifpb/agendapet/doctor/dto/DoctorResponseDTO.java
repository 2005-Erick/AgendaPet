package com.ifpb.agendapet.doctor.dto;

import com.ifpb.agendapet.shared.enums.RoleEnum;
import java.util.Set;

import java.util.UUID;

public record DoctorResponseDTO(UUID doctor_profile_id, UUID user_id, String name, String crmv, Set<RoleEnum> roles) {
}
