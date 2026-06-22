package com.ifpb.agendapet.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordDTO(@NotBlank String current_password, @NotBlank @Size(min = 8, max = 72) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).*$",
        message = "A senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial") String new_password) {
}
