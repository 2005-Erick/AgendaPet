package com.ifpb.agendapet.doctor;

import com.ifpb.agendapet.doctor.dto.DoctorCreateDTO;
import com.ifpb.agendapet.doctor.dto.DoctorResponseDTO;
import com.ifpb.agendapet.exception.ResourceErrorException;
import com.ifpb.agendapet.exception.ResourceNotFoundException;
import com.ifpb.agendapet.user.User;
import com.ifpb.agendapet.user.UserRepository;
import com.ifpb.agendapet.shared.enums.RoleEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public DoctorResponseDTO createDoctorProfile(DoctorCreateDTO dto) {
        User user = userRepository.findById(dto.user_id()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (doctorRepository.existsByUser_Id(user.getId())) {
            throw new ResourceErrorException();
        }

        Doctor doctor = new Doctor();

        doctor.setUser(user);
        doctor.setCrmv(dto.crmv());

        user.getRoles().add(RoleEnum.DOCTOR);
        userRepository.save(user);

        doctorRepository.save(doctor);

        return new DoctorResponseDTO(doctor.getId(), doctor.getUser().getId(), doctor.getUser().getName(),doctor.getCrmv(), doctor.getUser().getRoles());
    }

    public DoctorResponseDTO findById(UUID id) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Doutor não encontrado"));

        return new DoctorResponseDTO(doctor.getId(), doctor.getUser().getId(), doctor.getUser().getName(), doctor.getCrmv(), doctor.getUser().getRoles());
    }

    public List<DoctorResponseDTO> findAll() {
        List<Doctor> doctors = doctorRepository.findAll();

        List<DoctorResponseDTO> dtos = new ArrayList<>();

        for (Doctor doctor : doctors) {
            dtos.add(new DoctorResponseDTO(doctor.getId(), doctor.getUser().getId(), doctor.getUser().getName(), doctor.getCrmv(), doctor.getUser().getRoles()));
        }

        return dtos;
    }
}
