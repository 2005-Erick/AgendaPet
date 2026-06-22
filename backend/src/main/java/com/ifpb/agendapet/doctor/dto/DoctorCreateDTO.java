package com.ifpb.agendapet.doctor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record DoctorCreateDTO(@NotNull UUID user_id, @NotBlank
@Pattern(
        regexp = "^\\d{4,6}-[A-Z]{2}$",
        message = "CRMV deve estar no formato 1234-PB (4 a 6 números, conter hífen e UF)"
) String crmv) {
}
