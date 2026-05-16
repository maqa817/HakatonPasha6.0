package com.freshguard.admin.web;

import com.freshguard.admin.model.UserAccount;
import com.freshguard.admin.security.JwtService;
import com.freshguard.admin.service.UserService;
import com.freshguard.admin.web.dto.LoginRequest;
import com.freshguard.admin.web.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final long expirationMs;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserService userService,
            @Value("${freshguard.jwt.expiration-ms}") long expirationMs
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.expirationMs = expirationMs;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.userId(), request.password())
            );
            UserAccount u = userService.findByUserId(auth.getName())
                    .orElseThrow(() -> new BadCredentialsException("Naməlumatlar yanlışdır"));
            String token = jwtService.createToken(u.getUserId(), u.getRole().name());
            String display = u.getFirstName() + " " + u.getLastName();
            return ResponseEntity.ok(new LoginResponse(
                    token,
                    Math.max(1L, expirationMs / 1000),
                    u.getRole().name(),
                    display
            ));
        } catch (DisabledException e) {
            throw new BadCredentialsException("Hesab deaktivdir");
        }
    }
}
