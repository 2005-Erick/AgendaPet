package com.ifpb.agendapet.doctor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    boolean existsByUser_Id(UUID userId);
}
