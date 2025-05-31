package com.fpt.medically_be.service.impl;

import com.fpt.medically_be.dto.auth.LoginRequestDTO;
import com.fpt.medically_be.entity.AccountMember;
import com.fpt.medically_be.repos.AccountMemberRepos;
import com.fpt.medically_be.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AccountMemberRepos accountMemberRepos;

    private final PasswordEncoder passwordEncoder;

    @Override
    public AccountMember login(LoginRequestDTO loginRequest) {
        // Find user by email only
        Optional<AccountMember> accountMemberOpt = accountMemberRepos.findAccountMemberByEmail(
                loginRequest.getUsername()
        );
        
        if (accountMemberOpt.isPresent()) {
            AccountMember accountMember = accountMemberOpt.get();
            // Use PasswordEncoder to verify the password
            if (passwordEncoder.matches(loginRequest.getPassword(), accountMember.getPassword())) {
                return accountMember;
            }
        }
        
        return null;
    }

    @Override
    public AccountMember findById(String id) {
        return accountMemberRepos.findAccountMemberById(id).orElse(null);
    }
}