package com.ifpb.agendapet.appointment;

import com.ifpb.agendapet.appointment.dto.AppointmentCreateDTO;
import com.ifpb.agendapet.appointment.dto.AppointmentResponseDTO;
import com.ifpb.agendapet.appointment.dto.AppointmentUpdateDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> findById(@PathVariable UUID id) {
        AppointmentResponseDTO appointment = appointmentService.findById(id);

        return ResponseEntity.ok(appointment);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> findAll() {
        List<AppointmentResponseDTO> appointments = appointmentService.findAll();

        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> create(@Valid @RequestBody AppointmentCreateDTO dto) {
        AppointmentResponseDTO appointment = appointmentService.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody AppointmentUpdateDTO dto
    ) {
        AppointmentResponseDTO appointment = appointmentService.update(id, dto);

        return ResponseEntity.ok(appointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        appointmentService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}