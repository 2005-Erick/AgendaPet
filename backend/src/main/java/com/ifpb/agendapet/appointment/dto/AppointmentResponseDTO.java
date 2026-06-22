package com.ifpb.agendapet.appointment.dto;

import com.ifpb.agendapet.appointment.AppointmentStatus;
import com.ifpb.agendapet.appointment.AppointmentTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentResponseDTO(UUID id, UUID doctor_id, String doctor_name, UUID pet_id, String pet_name, LocalDateTime scheduled_at, AppointmentTypes type, AppointmentStatus status, BigDecimal price, com.ifpb.agendapet.shared.enums.PaymentStatus paymentStatus, String note, LocalDateTime created_at) {
}
