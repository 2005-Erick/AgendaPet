package com.ifpb.agendapet.doctor;

import com.ifpb.agendapet.doctor.dto.DoctorCreateDTO;
import com.ifpb.agendapet.doctor.dto.DoctorResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponseDTO> getDoctorById(@PathVariable UUID id) {
        DoctorResponseDTO doctor = doctorService.findById(id);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponseDTO>> getAllDoctors() {
        List<DoctorResponseDTO> doctors = doctorService.findAll();
        return ResponseEntity.ok(doctors);
    }

    @PostMapping
    public ResponseEntity<DoctorResponseDTO> createDoctorProfile(@Valid @RequestBody DoctorCreateDTO dto) {
        DoctorResponseDTO doctorProfile = doctorService.createDoctorProfile(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorProfile);
    }
}
