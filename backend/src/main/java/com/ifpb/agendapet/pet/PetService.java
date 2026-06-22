package com.ifpb.agendapet.pet;

import com.ifpb.agendapet.appointment.Appointment;
import com.ifpb.agendapet.appointment.dto.AppointmentResponseDTO;
import com.ifpb.agendapet.exception.ResourceErrorException;
import com.ifpb.agendapet.exception.ResourceNotFoundException;
import com.ifpb.agendapet.pet.dto.PetCreateDTO;
import com.ifpb.agendapet.pet.dto.PetResponseDTO;
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

    // Serviços

    public PetResponseDTO findById(UUID id) {
        Pet pet =  petRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado"));

        List<AppointmentResponseDTO> petAppointments = getPetAppointments(pet);

        return new PetResponseDTO(pet.getId(), pet.getName(), pet.getWeight(), pet.getTutor().getId(), pet.getTutor().getName(), pet.getGender(), pet.getBirthday(), pet.getSpecies(), pet.getBreed(), pet.getDescription(), petAppointments, pet.getCreatedAt(), pet.getUpdatedAt());
    }

    public List<PetResponseDTO> findAll() {
        List<Pet> pets = petRepository.findAll();

        List<PetResponseDTO> petsDto = new ArrayList<>();

        for (Pet pet : pets) {
            List<AppointmentResponseDTO> petAppointments = getPetAppointments(pet);

            petsDto.add(new PetResponseDTO(pet.getId(), pet.getName(), pet.getWeight(), pet.getTutor().getId(), pet.getTutor().getName(), pet.getGender(), pet.getBirthday(), pet.getSpecies(), pet.getBreed(), pet.getDescription(), petAppointments, pet.getCreatedAt(), pet.getUpdatedAt()));
        }

        return petsDto;
    }

    public PetResponseDTO create(PetCreateDTO dto) {
        if(petRepository.existsByTutor_Id(dto.tutor_id())) {
            throw new ResourceErrorException();
        }

        Pet pet = new Pet();

        User tutor = userRepository.findById(dto.tutor_id()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        pet.setTutor(tutor);
        pet.setName(dto.name());
        pet.setWeight(dto.weight());
        pet.setGender(dto.gender());
        pet.setBirthday(dto.birthday());
        pet.setSpecies(dto.species());
        pet.setBreed(dto.breed());
        pet.setDescription(dto.description());

        petRepository.save(pet);

        List<AppointmentResponseDTO> petAppointments = getPetAppointments(pet);

        return new PetResponseDTO(pet.getId(), pet.getName(), pet.getWeight(), pet.getTutor().getId(), pet.getTutor().getName(), pet.getGender(), pet.getBirthday(), pet.getSpecies(), pet.getBreed(), pet.getDescription(), petAppointments, pet.getCreatedAt(), pet.getUpdatedAt());
    }
}
