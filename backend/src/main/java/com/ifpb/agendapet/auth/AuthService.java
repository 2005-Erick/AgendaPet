package com.ifpb.agendapet.auth;

import com.ifpb.agendapet.auth.dto.LoginRequestDTO;
import com.ifpb.agendapet.auth.dto.VerifyMfaRequestDTO;
import com.ifpb.agendapet.config.TokenService;
import com.ifpb.agendapet.exception.ResourceErrorException;
import com.ifpb.agendapet.shared.enums.RoleEnum;
import com.ifpb.agendapet.user.User;
import com.ifpb.agendapet.user.UserRepository;
import com.ifpb.agendapet.auth.dto.RegisterRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final PendingRegistrationService pendingRegistrationService;

    public void login(LoginRequestDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.login(), dto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        User user = (User) auth.getPrincipal();
        
        String mfaCode = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setMfaCode(mfaCode);
        user.setMfaCodeExpiration(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        
        emailService.sendLoginCode(user.getEmail(), user.getName(), mfaCode);
    }

    public String confirmLogin(VerifyMfaRequestDTO dto) {
        User user = (User) userRepository.findByEmail(dto.email());
        if (user == null || user.getMfaCode() == null) {
            throw new ResourceErrorException("Solicitação de login inválida ou não encontrada.");
        }

        if (!user.getMfaCode().equals(dto.code())) {
            throw new ResourceErrorException("Código incorreto.");
        }

        if (user.getMfaCodeExpiration().isBefore(java.time.LocalDateTime.now())) {
            user.setMfaCode(null);
            user.setMfaCodeExpiration(null);
            userRepository.save(user);
            throw new ResourceErrorException("Código expirado. Faça o login novamente.");
        }

        user.setMfaCode(null);
        user.setMfaCodeExpiration(null);
        userRepository.save(user);

        return tokenService.generateToken(user);
    }



    public void register(RegisterRequestDTO dto) {
        if (dto.birthday() != null) {
            java.time.Period age = java.time.Period.between(dto.birthday(), java.time.LocalDate.now());
            if (age.getYears() < 18) {
                throw new ResourceErrorException("O tutor deve ter no mínimo 18 anos.");
            }
        }

        if (userRepository.findByEmail(dto.email()) != null) {
            throw new ResourceErrorException("E-mail já cadastrado no sistema.");
        }

        // Gera o código e salva na memória
        String mfaCode = String.format("%06d", new java.util.Random().nextInt(999999));
        pendingRegistrationService.addPendingRegistration(dto.email(), dto, mfaCode);

        // Envia o e-mail
        emailService.sendRegistrationCode(dto.email(), dto.name(), mfaCode);
    }

    public String confirmRegistration(VerifyMfaRequestDTO dto) {
        var pending = pendingRegistrationService.getPendingRegistration(dto.email());

        if (pending == null) {
            throw new ResourceErrorException("Solicitação de cadastro não encontrada ou expirada.");
        }

        if (!pending.pin().equals(dto.code())) {
            throw new ResourceErrorException("Código incorreto.");
        }

        if (pending.expiration().isBefore(java.time.LocalDateTime.now())) {
            pendingRegistrationService.removePendingRegistration(dto.email());
            throw new ResourceErrorException("Código expirado. Faça o cadastro novamente.");
        }

        RegisterRequestDTO userDto = pending.dto();
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDto.password());

        User newUser = User.builder()
                .name(userDto.name())
                .email(userDto.email())
                .password(encryptedPassword)
                .cpf(userDto.cpf())
                .avatarUrl(userDto.avatarUrl())
                .gender(userDto.gender())
                .birthday(userDto.birthday())
                .phone(userDto.phone())
                .roles(new HashSet<>(Set.of(RoleEnum.TUTOR)))
                .build();

        userRepository.save(newUser);
        pendingRegistrationService.removePendingRegistration(dto.email());

        return tokenService.generateToken(newUser);
    }
}
