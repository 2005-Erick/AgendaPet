package com.ifpb.agendapet.appointment.dto;

import com.ifpb.agendapet.appointment.AppointmentStatus;
import com.ifpb.agendapet.appointment.AppointmentTypes;
import com.ifpb.agendapet.shared.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentCreateDTO(
        @NotNull UUID doctor_id,

        @NotNull UUID pet_id,

        @NotNull
        @Future
        LocalDateTime scheduled_at,

        @NotNull
        AppointmentTypes type,

        AppointmentStatus status,

        @DecimalMin(value = "0.0", inclusive = true)
        BigDecimal price,

        PaymentStatus paymentStatus,

        @Size(max = 300)
        String note
) {
}