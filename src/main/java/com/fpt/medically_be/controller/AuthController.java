package com.fpt.medically_be.controller;

import com.fpt.medically_be.dto.auth.AuthResponseDTO;
import com.fpt.medically_be.dto.auth.LoginRequestDTO;
import com.fpt.medically_be.entity.MemberRole;
import com.fpt.medically_be.service.AuthService;
import com.fpt.medically_be.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private static final Logger logger = Logger.getLogger(AuthController.class.getName());
    
    private final AuthService authService;
    private final JwtService jwtService;


    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        logger.info("Login attempt for user: " + loginRequest.getUsername());
        
        var accountMember = authService.login(loginRequest);
        if (accountMember == null) {
            logger.warning("Login failed for user: " + loginRequest.getUsername());
            return ResponseEntity.status(401).build();
        } else {
            logger.info("Login successful for user: " + loginRequest.getUsername());
            AuthResponseDTO authResponseDTO = new AuthResponseDTO().toObject(accountMember);
            authResponseDTO.setToken(jwtService.generateToken(
                    accountMember.getId(),
                    accountMember.getEmail(),
                    accountMember.getRole()
            ));
            return ResponseEntity.ok(authResponseDTO);
        }

    }

    @GetMapping("/me")
    public ResponseEntity<MemberRole> getCurrentUser() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        Logger.getAnonymousLogger().info(email);
        var accountMember = authService.findById(email);

        return ResponseEntity.ok(accountMember.getRole());
    }
}