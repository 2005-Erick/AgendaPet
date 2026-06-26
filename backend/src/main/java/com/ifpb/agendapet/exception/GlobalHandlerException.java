package com.ifpb.agendapet.exception;

import com.ifpb.agendapet.exception.dto.StatusResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StatusResponseDTO> handleException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new StatusResponseDTO(e.getMessage()));
    }

    @ExceptionHandler(ResourceErrorException.class)
    public ResponseEntity<StatusResponseDTO> handleException(ResourceErrorException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new StatusResponseDTO(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<StatusResponseDTO> handleException(MethodArgumentTypeMismatchException e) {
        if ("id".equals(e.getName())) {

            return ResponseEntity.badRequest()
                    .body(new StatusResponseDTO("UUID inválido"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new StatusResponseDTO("Parâmetro inválido: " + e.getName()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<StatusResponseDTO> handleBadCredentials(org.springframework.security.authentication.BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new StatusResponseDTO("Credenciais inválidas."));
    }

    @ExceptionHandler(org.springframework.security.authentication.InternalAuthenticationServiceException.class)
    public ResponseEntity<StatusResponseDTO> handleInternalAuth(org.springframework.security.authentication.InternalAuthenticationServiceException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new StatusResponseDTO("Erro ao autenticar usuário."));
    }
}
