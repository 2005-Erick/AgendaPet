package com.ifpb.agendapet.user;

import com.ifpb.agendapet.auth.dto.RegisterRequestDTO;
import com.ifpb.agendapet.exception.ResourceErrorException;
import com.ifpb.agendapet.exception.ResourceNotFoundException;
import com.ifpb.agendapet.exception.dto.StatusResponseDTO;
import com.ifpb.agendapet.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponseDTO findById (UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(), user.getGender(), user.getBirthday(), user.getRoles(), user.getCreatedAt());
    }

    public UserResponseDTO create(RegisterRequestDTO dto) {
        if(userRepository.existsByCpf(dto.cpf()) || userRepository.existsByEmail(dto.email())) {
            throw new ResourceErrorException();
        }

        User user = new User();

        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setAvatarUrl(dto.avatarUrl());
        user.setGender(dto.gender());
        user.setBirthday(dto.birthday());
        user.setPassword(dto.password());
        user.setCpf(dto.cpf());
        user.setPhone(dto.phone());

        user = userRepository.save(user);

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(), user.getGender(), user.getBirthday(), user.getRoles(), user.getCreatedAt());
    }

    public List<UserResponseDTO> findAll() {
        List<User> users = userRepository.findAll();

        List<UserResponseDTO> dtos = new ArrayList<>();

        for (User user : users) {
            dtos.add(new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(), user.getGender(), user.getBirthday(), user.getRoles(), user.getCreatedAt()));
        }

        return dtos;
    }

    public void deleteById (UUID id) {
        if(!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }

        userRepository.deleteById(id);
    }

    public UserResponseDTO update (UUID id, UserUpdateDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if(dto.name() != null) {
            user.setName(dto.name());
        }

        if(dto.email() != null) {
            user.setEmail(dto.email());
        }

        if(dto.avatarUrl() != null) {
            user.setAvatarUrl(dto.avatarUrl());
        }

        if(dto.phone() != null) {
            user.setPhone(dto.phone());
        }

        if (dto.gender() != null) {
            user.setGender(dto.gender());
        }

        if(dto.birthday() != null) {
            user.setBirthday(dto.birthday());
        }

        user = userRepository.save(user);

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(), user.getGender(), user.getBirthday(), user.getRoles(), user.getCreatedAt());
    }

    public StatusResponseDTO updatePassword (UUID id, ChangePasswordDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if(dto.current_password() == null || !(dto.current_password().equals(user.getPassword())) || user.getPassword().equals(dto.new_password())) {
            throw new ResourceErrorException();
        }

        if(dto.new_password() != null) {
            user.setPassword(dto.new_password());
        }

        return new StatusResponseDTO("Senha alterada com sucesso.");
    }
}
