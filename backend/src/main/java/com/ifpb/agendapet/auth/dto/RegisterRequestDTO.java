package com.ifpb.agendapet.auth.dto;

import com.ifpb.agendapet.shared.enums.GenderEnum;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record RegisterRequestDTO(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 72) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).*$",
                message = "A senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial") String password,
        @NotBlank @CPF String cpf,
        @URL @Size(max = 300) String avatarUrl,
        @NotNull GenderEnum gender,
        @NotNull @Past LocalDate birthday,
        @NotBlank @Size(min = 8, max = 16) String phone
) {
}
