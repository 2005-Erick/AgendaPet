package com.ifpb.agendapet.pet.dto;

import com.ifpb.agendapet.pet.PetSpecies;
import com.ifpb.agendapet.shared.enums.GenderEnum;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;
import java.util.UUID;

public record PetUpdateDTO(
        UUID tutor_id,

        @Size(min = 2, max = 50)
        @Pattern(
                regexp = "^[\\p{L}]+( [\\p{L}]+)*$",
                message = "Nome deve conter apenas letras e espaços"
        )
        String name,

        Double weight,

        @URL
        @Size(max = 300)
        String avatarUrl,

        GenderEnum gender,

        @Past
        LocalDate birthday,

        PetSpecies species,

        @Size(min = 3, max = 50)
        String breed,

        @Size(max = 300)
        String description
) {
}