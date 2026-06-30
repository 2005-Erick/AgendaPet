package com.ifpb.agendapet.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    boolean existsByPet_IdAndScheduledAt(UUID petId, LocalDateTime scheduledAt);

    boolean existsByDoctor_IdAndScheduledAt(UUID doctorId, LocalDateTime scheduledAt);

    List<Appointment> findByPet_Tutor_Id(UUID tutorId);

    List<Appointment> findByDoctor_User_Id(UUID userId);
}