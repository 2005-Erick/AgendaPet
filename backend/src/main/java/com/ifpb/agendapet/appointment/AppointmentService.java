package com.ifpb.agendapet.appointment;

import com.ifpb.agendapet.appointment.dto.AppointmentCreateDTO;
import com.ifpb.agendapet.appointment.dto.AppointmentResponseDTO;
import com.ifpb.agendapet.doctor.Doctor;
import com.ifpb.agendapet.doctor.DoctorRepository;
import com.ifpb.agendapet.exception.ResourceErrorException;
import com.ifpb.agendapet.exception.ResourceNotFoundException;
import com.ifpb.agendapet.pet.Pet;
import com.ifpb.agendapet.pet.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PetRepository petRepository;

    public AppointmentResponseDTO findById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agendamento não existe"));

        return new AppointmentResponseDTO(appointment.getId(), appointment.getDoctor().getId(), appointment.getDoctor().getUser().getName(), appointment.getPet().getId(), appointment.getPet().getName(), appointment.getScheduledAt(), appointment.getType(), appointment.getStatus(), appointment.getPrice(), appointment.getPaymentStatus(), appointment.getNote(), appointment.getCreatedAt());
    }

    public List<AppointmentResponseDTO> findAll() {
        List<Appointment> appointments = appointmentRepository.findAll();
        List<AppointmentResponseDTO> dtos = new ArrayList<>();
        for (Appointment appointment : appointments) {
            dtos.add(new AppointmentResponseDTO(appointment.getId(), appointment.getDoctor().getId(), appointment.getDoctor().getUser().getName(), appointment.getPet().getId(), appointment.getPet().getName(), appointment.getScheduledAt(), appointment.getType(), appointment.getStatus(), appointment.getPrice(), appointment.getPaymentStatus(), appointment.getNote(), appointment.getCreatedAt()));
        }

        return dtos;
    }

    public AppointmentResponseDTO create(AppointmentCreateDTO dto) {
        if(appointmentRepository.existsByPet_IdAndScheduledAt(dto.pet_id(), dto.scheduled_at())) {
            throw new ResourceErrorException();
        }

        Appointment appointment = new Appointment();

        Doctor doctor = doctorRepository.findById(dto.doctor_id()).orElseThrow(() -> new ResourceNotFoundException("Doutor não existe"));

        Pet pet = petRepository.findById(dto.pet_id()).orElseThrow(() -> new ResourceNotFoundException("Pet não existe"));

        appointment.setDoctor(doctor);
        appointment.setPet(pet);
        appointment.setScheduledAt(dto.scheduled_at());
        appointment.setType(dto.type());
        if(!(dto.status() == null)) {
            appointment.setStatus(dto.status());
        }
        appointment.setNote(dto.note());

        appointmentRepository.save(appointment);

        return new AppointmentResponseDTO(appointment.getId(), appointment.getDoctor().getId(), appointment.getDoctor().getUser().getName(), appointment.getPet().getId(), appointment.getPet().getName(), appointment.getScheduledAt(), appointment.getType(), appointment.getStatus(), appointment.getPrice(), appointment.getPaymentStatus(), appointment.getNote(), appointment.getCreatedAt());
    }

    public void deleteById(UUID id) {
        if(!(appointmentRepository.existsById(id))) {
            throw new ResourceNotFoundException("Agendamento não existe.");
        }

        appointmentRepository.deleteById(id);
    }
}
