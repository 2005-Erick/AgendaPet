package com.ifpb.agendapet.user;

import com.ifpb.agendapet.exception.dto.StatusResponseDTO;
import com.ifpb.agendapet.user.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        UserResponseDTO dto = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getGender(),
                user.getBirthday(),
                user.getRoles(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable UUID id) {
        UserResponseDTO user = userService.findById(id);

        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll() {
        List<UserResponseDTO> dtos = userService.findAll();

        return ResponseEntity.ok(dtos);
    }
    
    @PostMapping
    public ResponseEntity<UserResponseDTO> createByAdmin(@Valid @RequestBody AdminCreateUserDTO dto) {
    UserResponseDTO user = userService.createByAdmin(dto);

    return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody UserUpdateDTO dto
    ) {
        UserResponseDTO user = userService.update(id, dto);

        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<StatusResponseDTO> updatePassword(
            @PathVariable UUID id,
            @Valid @RequestBody ChangePasswordDTO dto
    ) {
        StatusResponseDTO user = userService.updatePassword(id, dto);

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        userService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}