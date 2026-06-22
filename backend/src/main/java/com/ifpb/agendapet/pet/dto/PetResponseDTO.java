package com.ifpb.agendapet.pet.dto;

import com.ifpb.agendapet.appointment.dto.AppointmentResponseDTO;
import com.ifpb.agendapet.pet.PetSpecies;
import com.ifpb.agendapet.shared.enums.GenderEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PetResponseDTO(UUID id, String name, Double weight, UUID tutor_id, String tutor_name, GenderEnum gender, LocalDate birthday, PetSpecies species, String breed, String description, List<AppointmentResponseDTO> appointments, LocalDateTime created_at, LocalDateTime updated_at) {
}
