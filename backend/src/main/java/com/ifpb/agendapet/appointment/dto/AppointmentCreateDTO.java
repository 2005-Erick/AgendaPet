package com.ifpb.agendapet.appointment.dto;

import com.ifpb.agendapet.appointment.AppointmentStatus;
import com.ifpb.agendapet.appointment.AppointmentTypes;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentCreateDTO(@NotNull UUID doctor_id, @NotNull UUID pet_id, @NotNull @Future LocalDateTime scheduled_at, @NotNull AppointmentTypes type, AppointmentStatus status, @Size(max = 300) String note) {
}
