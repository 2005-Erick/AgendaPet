package com.ifpb.agendapet.user.dto;

import com.ifpb.agendapet.shared.enums.GenderEnum;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UserUpdateDTO(@NotBlank String name, @NotBlank @Size(min = 8, max = 16) String phone, @NotNull GenderEnum gender, @NotNull @Past LocalDate birthday, @NotBlank @Email String email) {
}
