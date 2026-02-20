package kitchenOrders.backend;

import kitchenOrders.backend.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

                // Disable CSRF for REST API
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(Customizer.withDefaults())

                // Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Allow login and auth endpoints
                        .requestMatchers("/auth/**").permitAll()

                        // Allow orders endpoints
                        .requestMatchers("/orders/**").permitAll()

                        // Allow menu endpoints
                        .requestMatchers("/menu/**").permitAll()

                        // Allow everything else (for now)
                        .anyRequest().permitAll()
                )

                // Add JWT filter before Spring authentication filter
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // Password encoder for login/register
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}