package com.ifpb.agendapet.pet;

import com.ifpb.agendapet.pet.dto.PetCreateDTO;
import com.ifpb.agendapet.pet.dto.PetResponseDTO;
import com.ifpb.agendapet.pet.dto.PetUpdateDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pets")
@CrossOrigin(
    origins = "http://localhost:4200",
    allowCredentials = "true"
)
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;

    @GetMapping("/{id}")
    public ResponseEntity<PetResponseDTO> findById(@PathVariable UUID id) {
        PetResponseDTO pet = petService.findById(id);

        return ResponseEntity.ok(pet);
    }

    @GetMapping
    public ResponseEntity<List<PetResponseDTO>> findAll() {
        List<PetResponseDTO> pets = petService.findAll();

        return ResponseEntity.ok(pets);
    }

    @PostMapping
    public ResponseEntity<PetResponseDTO> create(@Valid @RequestBody PetCreateDTO dto) {
        PetResponseDTO pet = petService.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(pet);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PetResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody PetUpdateDTO dto
    ) {
        PetResponseDTO pet = petService.update(id, dto);

        return ResponseEntity.ok(pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        petService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}