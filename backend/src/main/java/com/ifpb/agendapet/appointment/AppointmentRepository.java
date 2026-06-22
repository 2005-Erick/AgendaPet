package com.ifpb.agendapet.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    boolean existsByPet_IdAndScheduledAt(UUID pet_id, LocalDateTime scheduled_at);
}