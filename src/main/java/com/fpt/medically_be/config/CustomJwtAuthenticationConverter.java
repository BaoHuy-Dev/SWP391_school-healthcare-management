package com.fpt.medically_be.config;

import com.fpt.medically_be.entity.MemberRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Custom converter for JWT authentication
 */
@Component
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private static final Logger LOGGER = LoggerFactory.getLogger(CustomJwtAuthenticationConverter.class);
    private static final String ROLE_CLAIM = "role";

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Map<String, Object> claims = jwt.getClaims();
        LOGGER.debug("JWT claims: {}", claims);

        String rawRole = jwt.getClaimAsString(ROLE_CLAIM);
        LOGGER.debug("Raw role claim from JWT: '{}'", rawRole);

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        try {
            MemberRole role = MemberRole.valueOf(rawRole);
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.name());
            authorities.add(authority);
        } catch (Exception e) {
            if (rawRole != null && !rawRole.isEmpty()) {
                String roleWithPrefix = rawRole.startsWith("ROLE_") ? rawRole : "ROLE_" + rawRole.toUpperCase();
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleWithPrefix);
                authorities.add(authority);
            }
        }

        // Ensure we have at least one authority
        if (authorities.isEmpty()) {
            LOGGER.warn("No authorities extracted from JWT. Using default authority.");
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        // Create JwtAuthenticationToken with extracted authorities
        JwtAuthenticationToken token = new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
        LOGGER.debug("Created JWT authentication token with authorities: {}", authorities);

        return token;
    }
}