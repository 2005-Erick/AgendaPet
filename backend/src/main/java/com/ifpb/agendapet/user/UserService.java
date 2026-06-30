package com.ifpb.agendapet.user;

import com.ifpb.agendapet.auth.dto.RegisterRequestDTO;
import com.ifpb.agendapet.doctor.Doctor;
import com.ifpb.agendapet.doctor.DoctorRepository;
import com.ifpb.agendapet.exception.ResourceErrorException;
import com.ifpb.agendapet.exception.ResourceNotFoundException;
import com.ifpb.agendapet.exception.dto.StatusResponseDTO;
import com.ifpb.agendapet.shared.enums.RoleEnum;
import com.ifpb.agendapet.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO findById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return toResponseDTO(user);
    }

    public UserResponseDTO create(RegisterRequestDTO dto) {
        if (userRepository.existsByCpf(dto.cpf()) || userRepository.existsByEmail(dto.email())) {
            throw new ResourceErrorException();
        }

        User user = new User();

        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setAvatarUrl(dto.avatarUrl());
        user.setGender(dto.gender());
        user.setBirthday(dto.birthday());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setCpf(dto.cpf());
        user.setPhone(dto.phone());
        user.setRoles(new HashSet<>(Set.of(RoleEnum.TUTOR)));

        user = userRepository.save(user);

        return toResponseDTO(user);
    }

    public UserResponseDTO createByAdmin(AdminCreateUserDTO dto) {
        if (userRepository.existsByCpf(dto.cpf())) {
            throw new ResourceErrorException("CPF já cadastrado no sistema.");
        }

        if (userRepository.existsByEmail(dto.email())) {
            throw new ResourceErrorException("E-mail já cadastrado no sistema.");
        }

        if (dto.role() == RoleEnum.DOCTOR && (dto.crmv() == null || dto.crmv().isBlank())) {
            throw new ResourceErrorException("CRMV é obrigatório para médicos.");
        }

        User user = new User();

        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setAvatarUrl(dto.avatarUrl());
        user.setGender(dto.gender());
        user.setBirthday(dto.birthday());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setCpf(dto.cpf());
        user.setPhone(dto.phone());
        user.setRoles(new HashSet<>(Set.of(dto.role())));

        user = userRepository.save(user);

        if (dto.role() == RoleEnum.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(user);
            doctor.setCrmv(dto.crmv());

            doctorRepository.save(doctor);
        }

        return toResponseDTO(user);
    }

    public List<UserResponseDTO> findAll() {
        List<User> users = userRepository.findAll();

        List<UserResponseDTO> dtos = new ArrayList<>();

        for (User user : users) {
            dtos.add(toResponseDTO(user));
        }

        return dtos;
    }

    public void deleteById(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }

        userRepository.deleteById(id);
    }

    public UserResponseDTO update(UUID id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (dto.email() != null && !dto.email().equals(user.getEmail()) && userRepository.existsByEmail(dto.email())) {
            throw new ResourceErrorException("E-mail já cadastrado no sistema.");
        }

        if (dto.name() != null) {
            user.setName(dto.name());
        }

        if (dto.email() != null) {
            user.setEmail(dto.email());
        }

        if (dto.avatarUrl() != null) {
            user.setAvatarUrl(dto.avatarUrl());
        }

        if (dto.phone() != null) {
            user.setPhone(dto.phone());
        }

        if (dto.gender() != null) {
            user.setGender(dto.gender());
        }

        if (dto.birthday() != null) {
            user.setBirthday(dto.birthday());
        }

        user = userRepository.save(user);

        return toResponseDTO(user);
    }

    public StatusResponseDTO updatePassword(UUID id, ChangePasswordDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (dto.current_password() == null || dto.new_password() == null) {
            throw new ResourceErrorException("Informe a senha atual e a nova senha.");
        }

        if (!passwordEncoder.matches(dto.current_password(), user.getPassword())) {
            throw new ResourceErrorException("Senha atual inválida.");
        }

        if (passwordEncoder.matches(dto.new_password(), user.getPassword())) {
            throw new ResourceErrorException("A nova senha deve ser diferente da atual.");
        }

        user.setPassword(passwordEncoder.encode(dto.new_password()));

        userRepository.save(user);

        return new StatusResponseDTO("Senha alterada com sucesso.");
    }

    private UserResponseDTO toResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getGender(),
                user.getBirthday(),
                user.getRoles(),
                user.getCreatedAt()
        );
    }
}