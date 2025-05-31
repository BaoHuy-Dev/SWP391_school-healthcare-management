package com.fpt.medically_be.dto.auth;

import com.fpt.medically_be.base.BaseMapper;
import com.fpt.medically_be.entity.AccountMember;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.logging.Logger;

@EqualsAndHashCode(callSuper = true)
@Data
public class AuthResponseDTO extends BaseMapper<AccountMember, AuthResponseDTO> {
    
    private static final Logger logger = Logger.getLogger(AuthResponseDTO.class.getName());
    
    private String memberId;
    private String email;
    private String role;
    private String token;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(String id, String email, String role, String token) {
        this.memberId = id;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    @Override
    public AuthResponseDTO toObject(AccountMember entity) {
        if (entity == null) {
            return null;
        }

        this.memberId = entity.getId();
        this.email = entity.getEmail();
        this.role = entity.getRole().name();

        return this;
    }
}