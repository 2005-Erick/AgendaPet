package com.ifpb.agendapet.user.dto;

import com.ifpb.agendapet.shared.enums.GenderEnum;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

public record UserUpdateDTO(String name, @Size(min = 8, max = 16) String phone, @URL @Size(max = 300) String avatarUrl, GenderEnum gender, @Past LocalDate birthday, @Email String email) {
}
