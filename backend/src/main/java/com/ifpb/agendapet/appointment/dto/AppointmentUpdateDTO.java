package com.ifpb.agendapet.appointment.dto;

import com.ifpb.agendapet.appointment.AppointmentStatus;
import com.ifpb.agendapet.appointment.AppointmentTypes;
import com.ifpb.agendapet.shared.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentUpdateDTO(
        UUID doctor_id,

        UUID pet_id,

        @Future
        LocalDateTime scheduled_at,

        AppointmentTypes type,

        AppointmentStatus status,

        @DecimalMin(value = "0.0", inclusive = true)
        BigDecimal price,

        PaymentStatus paymentStatus,

        @Size(max = 300)
        String note
) {
}