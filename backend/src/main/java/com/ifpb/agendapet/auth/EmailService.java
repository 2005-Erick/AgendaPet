package com.ifpb.agendapet.auth;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    public void sendMfaCode(String to, String code) {
        Resend resend = new Resend(resendApiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("AgendaPet <agendapet@mail.caiomayan.com>")
                .to(to)
                .subject("AgendaPet - Seu código de acesso")
                .html("<p>Olá! Seu código de verificação é: <strong>" + code + "</strong></p><p>Este código expira em 10 minutos.</p>")
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println("Email enviado! ID: " + data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao enviar email de verificação.");
        }
    }
}
