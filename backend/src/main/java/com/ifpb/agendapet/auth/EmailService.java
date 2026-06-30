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

    private void sendHtmlEmail(String to, String subject, String name, String contextMessage, String code) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            System.out.println("[MOCK EMAIL] To: " + to);
            System.out.println("[MOCK EMAIL] Subject: " + subject);
            System.out.println("[MOCK EMAIL] Code: " + code);
            return;
        }

        String htmlTemplate = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #2c3e50; margin: 0;">AgendaPet</h2>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #eeeeee;">
                        <p style="color: #333333; font-size: 16px;">Olá, <strong>%s</strong>,</p>
                        <p style="color: #555555; font-size: 15px; line-height: 1.5;">%s</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #ffffff; background-color: #4CAF50; padding: 12px 24px; border-radius: 6px; letter-spacing: 4px;">%s</span>
                        </div>
                        <p style="color: #777777; font-size: 14px;">Este código é válido por 10 minutos. Por favor, não o compartilhe com ninguém.</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <p style="color: #999999; font-size: 12px;">Se você não solicitou este código, por favor, ignore este e-mail.</p>
                    </div>
                </div>
                """;

        String htmlContent = String.format(htmlTemplate, name, contextMessage, code);

        Resend resend = new Resend(resendApiKey);
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("AgendaPet <agendapet@mail.caiomayan.com>")
                .to(to)
                .subject(subject)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println("Email enviado! ID: " + data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao enviar email de verificação.");
        }
    }

    public void sendRegistrationCode(String to, String name, String code) {
        sendHtmlEmail(
                to,
                "Bem-vindo(a) ao AgendaPet! Confirme seu e-mail",
                name,
                "Ficamos felizes em ter você conosco! Para concluir o seu cadastro, utilize o código de verificação abaixo:",
                code
        );
    }

    public void sendLoginCode(String to, String name, String code) {
        sendHtmlEmail(
                to,
                "AgendaPet - Código de acesso seguro",
                name,
                "Recebemos uma solicitação de login na sua conta. Para garantir a sua segurança, utilize o código abaixo para acessar o sistema:",
                code
        );
    }
}
