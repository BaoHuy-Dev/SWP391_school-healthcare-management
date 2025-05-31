package com.fpt.medically_be.service.impl;

import com.fpt.medically_be.entity.MemberRole;
import com.fpt.medically_be.service.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtServiceImpl implements JwtService {

    private final JwtEncoder encoder;
    private final long expirationTime;
    private final String issuer;

    public JwtServiceImpl(JwtEncoder encoder,
                          @Value("${jwt.expiration}") long expirationTime,
                          @Value("${jwt.issuer}") String issuer) {

        this.encoder = encoder;
        this.expirationTime = expirationTime;
        this.issuer = issuer;
    }

    @Override
    public String generateToken(String accountId, String email, MemberRole role) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(expirationTime, ChronoUnit.SECONDS))
                .subject(accountId)
                .claim("role", role.name())
                .build();

        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}