package com.ifpb.agendapet.appointment;

import com.ifpb.agendapet.appointment.dto.AppointmentCreateDTO;
import com.ifpb.agendapet.appointment.dto.AppointmentResponseDTO;
import com.ifpb.agendapet.appointment.dto.AppointmentUpdateDTO;
import com.ifpb.agendapet.doctor.Doctor;
import com.ifpb.agendapet.doctor.DoctorRepository;
import com.ifpb.agendapet.exception.ResourceErrorException;
import com.ifpb.agendapet.exception.ResourceNotFoundException;
import com.ifpb.agendapet.pet.Pet;
import com.ifpb.agendapet.pet.PetRepository;
import com.ifpb.agendapet.shared.enums.PaymentStatus;
import com.ifpb.agendapet.shared.enums.RoleEnum;
import com.ifpb.agendapet.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PetRepository petRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new ResourceErrorException("Usuário não autenticado.");
        }

        return user;
    }

    private boolean isTutor(User user) {
        return user.getRoles().contains(RoleEnum.TUTOR) && !user.getRoles().contains(RoleEnum.ADMIN);
    }

    private boolean canAccessAppointment(User currentUser, Appointment appointment) {
        if (!isTutor(currentUser)) {
            return true;
        }

        return appointment.getPet().getTutor().getId().equals(currentUser.getId());
    }

    private AppointmentResponseDTO getAppointmentResponseDTO(Appointment appointment) {
        return new AppointmentResponseDTO(
                appointment.getId(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getUser().getName(),
                appointment.getPet().getId(),
                appointment.getPet().getName(),
                appointment.getScheduledAt(),
                appointment.getType(),
                appointment.getStatus(),
                appointment.getPrice(),
                appointment.getPaymentStatus(),
                appointment.getNote(),
                appointment.getCreatedAt()
        );
    }

    public AppointmentResponseDTO findById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não existe"));

        if (!canAccessAppointment(getCurrentUser(), appointment)) {
            throw new ResourceErrorException("Você não tem permissão para acessar este agendamento.");
        }

        return getAppointmentResponseDTO(appointment);
    }

    public List<AppointmentResponseDTO> findAll() {
        User currentUser = getCurrentUser();

        List<Appointment> appointments;

        if (currentUser.getRoles().contains(RoleEnum.TUTOR)) {
            appointments = appointmentRepository.findByPet_Tutor_Id(currentUser.getId());
        } else if (currentUser.getRoles().contains(RoleEnum.DOCTOR)) {
            appointments = appointmentRepository.findByDoctor_User_Id(currentUser.getId());
        } else {
            appointments = appointmentRepository.findAll();
        }

        List<AppointmentResponseDTO> dtos = new ArrayList<>();

        for (Appointment appointment : appointments) {
            dtos.add(getAppointmentResponseDTO(appointment));
        }

        return dtos;
    }

    public AppointmentResponseDTO create(AppointmentCreateDTO dto) {
        User currentUser = getCurrentUser();

        validateScheduleConflict(null, dto.doctor_id(), dto.pet_id(), dto.scheduled_at());

        Doctor doctor = doctorRepository.findById(dto.doctor_id())
                .orElseThrow(() -> new ResourceNotFoundException("Doutor não existe"));

        Pet pet = petRepository.findById(dto.pet_id())
                .orElseThrow(() -> new ResourceNotFoundException("Pet não existe"));

        if (isTutor(currentUser) && !pet.getTutor().getId().equals(currentUser.getId())) {
            throw new ResourceErrorException("Você só pode agendar consultas para os seus próprios pets.");
        }

        Appointment appointment = new Appointment();

        appointment.setDoctor(doctor);
        appointment.setPet(pet);
        appointment.setScheduledAt(dto.scheduled_at());
        appointment.setType(dto.type());

        if (dto.status() != null) {
            appointment.setStatus(dto.status());
        }

        if (dto.paymentStatus() != null) {
            appointment.setPaymentStatus(dto.paymentStatus());
        } else {
            appointment.setPaymentStatus(PaymentStatus.PENDING);
        }

        appointment.setPrice(dto.price());
        appointment.setNote(dto.note());

        appointmentRepository.save(appointment);

        return getAppointmentResponseDTO(appointment);
    }

    public AppointmentResponseDTO update(UUID id, AppointmentUpdateDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não existe"));

        User currentUser = getCurrentUser();

        if (!canAccessAppointment(currentUser, appointment)) {
            throw new ResourceErrorException("Você não tem permissão para alterar este agendamento.");
        }

        UUID doctorId = dto.doctor_id() != null
                ? dto.doctor_id()
                : appointment.getDoctor().getId();

        UUID petId = dto.pet_id() != null
                ? dto.pet_id()
                : appointment.getPet().getId();

        LocalDateTime scheduledAt = dto.scheduled_at() != null
                ? dto.scheduled_at()
                : appointment.getScheduledAt();

        validateScheduleConflict(id, doctorId, petId, scheduledAt);

        if (dto.doctor_id() != null) {
            Doctor doctor = doctorRepository.findById(dto.doctor_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Doutor não existe"));

            appointment.setDoctor(doctor);
        }

        if (dto.pet_id() != null) {
            Pet pet = petRepository.findById(dto.pet_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Pet não existe"));

            if (isTutor(currentUser) && !pet.getTutor().getId().equals(currentUser.getId())) {
                throw new ResourceErrorException("Você só pode vincular pets que pertencem à sua conta.");
            }

            appointment.setPet(pet);
        }

        if (dto.scheduled_at() != null) {
            appointment.setScheduledAt(dto.scheduled_at());
        }

        if (dto.type() != null) {
            appointment.setType(dto.type());
        }

        if (dto.status() != null) {
            appointment.setStatus(dto.status());
        }

        if (dto.price() != null) {
            appointment.setPrice(dto.price());
        }

        if (dto.paymentStatus() != null) {
            appointment.setPaymentStatus(dto.paymentStatus());
        }

        if (dto.note() != null) {
            appointment.setNote(dto.note());
        }

        appointmentRepository.save(appointment);

        return getAppointmentResponseDTO(appointment);
    }

    public void deleteById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não existe."));

        if (!canAccessAppointment(getCurrentUser(), appointment)) {
            throw new ResourceErrorException("Você não tem permissão para excluir este agendamento.");
        }

        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Agendamento não existe.");
        }

        appointmentRepository.deleteById(id);
    }

    private void validateScheduleConflict(
            UUID currentAppointmentId,
            UUID doctorId,
            UUID petId,
            LocalDateTime scheduledAt
    ) {
        List<Appointment> appointments = appointmentRepository.findAll();

        for (Appointment appointment : appointments) {
            boolean isSameAppointment = currentAppointmentId != null
                    && appointment.getId().equals(currentAppointmentId);

            if (isSameAppointment) {
                continue;
            }

            boolean sameTime = appointment.getScheduledAt().equals(scheduledAt);
            boolean sameDoctor = appointment.getDoctor().getId().equals(doctorId);
            boolean samePet = appointment.getPet().getId().equals(petId);

            if (sameTime && sameDoctor) {
                throw new ResourceErrorException("O médico já possui um agendamento neste horário.");
            }

            if (sameTime && samePet) {
                throw new ResourceErrorException("O pet já possui um agendamento neste horário.");
            }
        }
    }
}