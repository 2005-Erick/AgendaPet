package com.ifpb.agendapet.pet.dto;

import com.ifpb.agendapet.pet.PetSpecies;
import com.ifpb.agendapet.shared.enums.GenderEnum;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.UUID;

public record PetCreateDTO(@NotNull UUID tutor_id, @NotBlank
@Size(min = 2, max = 50)
@Pattern(
        regexp = "^[\\p{L}]+( [\\p{L}]+)*$",
        message = "Nome deve conter apenas letras e espaços"
) String name, @NotNull Double weight, @NotNull GenderEnum gender, @NotNull @Past LocalDate birthday, @NotNull PetSpecies species, @NotBlank @Size(min = 3, max = 50) String breed, @Size(max = 300) String description) {
}
