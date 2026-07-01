package com.ifpb.agendapet.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        System.out.println("SECURITY CONFIG ATIVO");

        return http
                .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorize -> authorize

                        // Rotas públicas
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/health").permitAll()

                        // Usuários
                        .requestMatchers(HttpMethod.GET, "/users/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")

                        // Appointments
                        .requestMatchers(HttpMethod.GET, "/appointments/**").hasAnyRole("ADMIN", "RECEPTIONIST", "DOCTOR", "TUTOR")
                        .requestMatchers(HttpMethod.POST, "/appointments").hasAnyRole("ADMIN", "RECEPTIONIST", "TUTOR")
                        .requestMatchers(HttpMethod.PATCH, "/appointments/**").hasAnyRole("ADMIN", "RECEPTIONIST", "DOCTOR", "TUTOR")
                        .requestMatchers(HttpMethod.DELETE, "/appointments/**").hasAnyRole("ADMIN", "RECEPTIONIST", "TUTOR")

                        // Pets
                        .requestMatchers(HttpMethod.GET, "/pets/**").hasAnyRole("ADMIN", "RECEPTIONIST", "DOCTOR", "TUTOR")
                        .requestMatchers(HttpMethod.POST, "/pets").hasAnyRole("ADMIN", "RECEPTIONIST", "TUTOR")
                        .requestMatchers(HttpMethod.PATCH, "/pets/**").hasAnyRole("ADMIN", "RECEPTIONIST", "TUTOR")
                        .requestMatchers(HttpMethod.DELETE, "/pets/**").hasAnyRole("ADMIN", "RECEPTIONIST", "TUTOR")

                        // Doctors
                        .requestMatchers(HttpMethod.GET, "/doctors/**").hasAnyRole("ADMIN", "RECEPTIONIST", "DOCTOR", "TUTOR")
                        .requestMatchers(HttpMethod.POST, "/doctors").hasAnyRole("ADMIN", "RECEPTIONIST")

                        // Qualquer outra rota exige login
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH"
        ));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}