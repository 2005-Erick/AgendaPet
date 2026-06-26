package com.ifpb.agendapet.auth;

import com.ifpb.agendapet.auth.dto.AuthenticateResponseDTO;
import com.ifpb.agendapet.auth.dto.LoginRequestDTO;
import com.ifpb.agendapet.auth.dto.VerifyMfaRequestDTO;
import com.ifpb.agendapet.exception.dto.StatusResponseDTO;
import com.ifpb.agendapet.auth.dto.RegisterRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthorizationController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<StatusResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        authService.login(dto);
        return ResponseEntity.ok(new StatusResponseDTO("Código de verificação enviado para o seu e-mail."));
    }

    @PostMapping("/login/confirm")
    public ResponseEntity<AuthenticateResponseDTO> confirmLogin(@RequestBody @Valid VerifyMfaRequestDTO dto) {
        String token = authService.confirmLogin(dto);
        return ResponseEntity.ok(new AuthenticateResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<StatusResponseDTO> register(@RequestBody @Valid RegisterRequestDTO dto) {
        authService.register(dto);
        return ResponseEntity.ok(new StatusResponseDTO("Verifique seu e-mail para concluir o cadastro."));
    }

    @PostMapping("/register/confirm")
    public ResponseEntity<AuthenticateResponseDTO> confirmRegistration(@RequestBody @Valid VerifyMfaRequestDTO dto) {
        String token = authService.confirmRegistration(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthenticateResponseDTO(token));
    }
}
