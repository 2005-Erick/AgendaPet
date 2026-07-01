package com.ifpb.agendapet.auth;

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
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthorizationController {

    private final AuthService authService;

    private ResponseCookie createAuthCookie(String token) {
        return ResponseCookie.from("auth_token", token)
                .httpOnly(true)
                .secure(true) // Necessário ser true para SameSite=None
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("None") // Necessário para cross-origin (Render backend + localhost frontend)
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<StatusResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        authService.login(dto);
        return ResponseEntity.ok(new StatusResponseDTO("Código de verificação enviado para o seu e-mail."));
    }

    @PostMapping("/login/confirm")
    public ResponseEntity<StatusResponseDTO> confirmLogin(@RequestBody @Valid VerifyMfaRequestDTO dto) {
        String token = authService.confirmLogin(dto);
        ResponseCookie cookie = createAuthCookie(token);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new StatusResponseDTO("Login confirmado com sucesso."));
    }

    @PostMapping("/register")
    public ResponseEntity<StatusResponseDTO> register(@RequestBody @Valid RegisterRequestDTO dto) {
        authService.register(dto);
        return ResponseEntity.ok(new StatusResponseDTO("Verifique seu e-mail para concluir o cadastro."));
    }

    @PostMapping("/register/confirm")
    public ResponseEntity<StatusResponseDTO> confirmRegistration(@RequestBody @Valid VerifyMfaRequestDTO dto) {
        String token = authService.confirmRegistration(dto);

        ResponseCookie cookie = createAuthCookie(token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new StatusResponseDTO("Cadastro confirmado com sucesso."));
    }

    @PostMapping("/logout")
    public ResponseEntity<StatusResponseDTO> logout() {
        ResponseCookie cookie = ResponseCookie.from("auth_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new StatusResponseDTO("Logout realizado com sucesso."));
    }
}
