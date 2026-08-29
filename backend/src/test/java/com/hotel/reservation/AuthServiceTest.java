package com.hotel.reservation;

import com.hotel.reservation.dto.AuthResponse;
import com.hotel.reservation.dto.LoginRequest;
import com.hotel.reservation.dto.RegisterRequest;
import com.hotel.reservation.entity.Role;
import com.hotel.reservation.entity.User;
import com.hotel.reservation.exception.DuplicateResourceException;
import com.hotel.reservation.repository.UserRepository;
import com.hotel.reservation.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setup() {
        userRepository.findByUsername("authtestuser").ifPresent(userRepository::delete);
    }

    @Test
    @DisplayName("Should successfully register user and return valid JWT token")
    public void testUserRegistration() {
        RegisterRequest registerReq = new RegisterRequest(
            "authtestuser",
            "authtestuser@example.com",
            "securePass123",
            "Auth Test User",
            "+1-555-0101",
            Role.ROLE_CUSTOMER
        );

        AuthResponse response = authService.register(registerReq);

        assertNotNull(response);
        assertNotNull(response.getToken(), "Token must not be null");
        assertEquals("authtestuser", response.getUsername());
        assertEquals(Role.ROLE_CUSTOMER, response.getRole());

        // Verify password is encrypted in database
        User saved = userRepository.findByUsername("authtestuser").orElseThrow();
        assertNotEquals("securePass123", saved.getPassword());
        assertTrue(passwordEncoder.matches("securePass123", saved.getPassword()));
    }

    @Test
    @DisplayName("Should reject duplicate username registration")
    public void testDuplicateUsernameRejection() {
        RegisterRequest req1 = new RegisterRequest(
            "authtestuser", "user1@example.com", "pass1234", "User One", null, Role.ROLE_CUSTOMER
        );
        authService.register(req1);

        RegisterRequest req2 = new RegisterRequest(
            "authtestuser", "user2@example.com", "pass1234", "User Two", null, Role.ROLE_CUSTOMER
        );

        assertThrows(DuplicateResourceException.class, () -> authService.register(req2));
    }

    @Test
    @DisplayName("Should successfully authenticate and generate token on valid login")
    public void testSuccessfulLogin() {
        RegisterRequest registerReq = new RegisterRequest(
            "authtestuser", "authtestuser@example.com", "mySecret123", "Login User", null, Role.ROLE_CUSTOMER
        );
        authService.register(registerReq);

        LoginRequest loginReq = new LoginRequest("authtestuser", "mySecret123");
        AuthResponse response = authService.login(loginReq);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("authtestuser", response.getUsername());
    }

    @Test
    @DisplayName("Should reject invalid password with BadCredentialsException")
    public void testInvalidPasswordLogin() {
        RegisterRequest registerReq = new RegisterRequest(
            "authtestuser", "authtestuser@example.com", "mySecret123", "Login User", null, Role.ROLE_CUSTOMER
        );
        authService.register(registerReq);

        LoginRequest badLogin = new LoginRequest("authtestuser", "wrongpassword");
        assertThrows(BadCredentialsException.class, () -> authService.login(badLogin));
    }
}
