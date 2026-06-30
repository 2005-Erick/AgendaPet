package com.ifpb.agendapet.pet;

import com.ifpb.agendapet.appointment.Appointment;
import com.ifpb.agendapet.appointment.dto.AppointmentResponseDTO;
import com.ifpb.agendapet.exception.ResourceNotFoundException;
import com.ifpb.agendapet.pet.dto.PetCreateDTO;
import com.ifpb.agendapet.pet.dto.PetResponseDTO;
import com.ifpb.agendapet.pet.dto.PetUpdateDTO;
import com.ifpb.agendapet.user.User;
import com.ifpb.agendapet.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    // Util
    private static List<AppointmentResponseDTO> getPetAppointments(Pet pet) {
        if (pet.getAppointments() == null || pet.getAppointments().isEmpty()) {
            return List.of();
        }

        List<AppointmentResponseDTO> petAppointments = new ArrayList<>();

        for (Appointment appointment : pet.getAppointments()) {
            petAppointments.add(
                    new AppointmentResponseDTO(
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
                    )
            );
        }

        return petAppointments;
    }

    @NonNull
    private PetResponseDTO getPetResponseDTO(Pet pet) {
        List<AppointmentResponseDTO> petAppointments = getPetAppointments(pet);

        return new PetResponseDTO(
                pet.getId(),
                pet.getName(),
                pet.getAvatarUrl(),
                pet.getWeight(),
                pet.getTutor().getId(),
                pet.getTutor().getName(),
                pet.getGender(),
                pet.getBirthday(),
                pet.getSpecies(),
                pet.getBreed(),
                pet.getDescription(),
                petAppointments,
                pet.getCreatedAt(),
                pet.getUpdatedAt()
        );
    }

    // Serviços

    public PetResponseDTO findById(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado"));

        return getPetResponseDTO(pet);
    }

    public List<PetResponseDTO> findAll() {
        List<Pet> pets = petRepository.findAll();

        List<PetResponseDTO> petsDto = new ArrayList<>();

        for (Pet pet : pets) {
            petsDto.add(getPetResponseDTO(pet));
        }

        return petsDto;
    }

    public PetResponseDTO create(PetCreateDTO dto) {
        Pet pet = new Pet();

        User tutor = userRepository.findById(dto.tutor_id())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        pet.setTutor(tutor);
        pet.setName(dto.name());
        pet.setAvatarUrl(dto.avatarUrl());
        pet.setWeight(dto.weight());
        pet.setGender(dto.gender());
        pet.setBirthday(dto.birthday());
        pet.setSpecies(dto.species());
        pet.setBreed(dto.breed());
        pet.setDescription(dto.description());

        petRepository.save(pet);

        return getPetResponseDTO(pet);
    }

    public PetResponseDTO update(UUID id, PetUpdateDTO dto) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado"));

        if (dto.tutor_id() != null) {
            User tutor = userRepository.findById(dto.tutor_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Tutor não encontrado"));

            pet.setTutor(tutor);
        }

        if (dto.name() != null) {
            pet.setName(dto.name());
        }

        if (dto.weight() != null) {
            pet.setWeight(dto.weight());
        }

        if (dto.avatarUrl() != null) {
            pet.setAvatarUrl(dto.avatarUrl());
        }

        if (dto.gender() != null) {
            pet.setGender(dto.gender());
        }

        if (dto.birthday() != null) {
            pet.setBirthday(dto.birthday());
        }

        if (dto.species() != null) {
            pet.setSpecies(dto.species());
        }

        if (dto.breed() != null) {
            pet.setBreed(dto.breed());
        }

        if (dto.description() != null) {
            pet.setDescription(dto.description());
        }

        petRepository.save(pet);

        return getPetResponseDTO(pet);
    }

    public void deleteById(UUID id) {
        if (!petRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet não encontrado");
        }

        petRepository.deleteById(id);
    }
}