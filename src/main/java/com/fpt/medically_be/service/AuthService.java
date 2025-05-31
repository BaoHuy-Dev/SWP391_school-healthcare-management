package com.fpt.medically_be.service;

import com.fpt.medically_be.dto.auth.LoginRequestDTO;
import com.fpt.medically_be.entity.AccountMember;


public interface AuthService {

    AccountMember login(LoginRequestDTO loginRequest);

    AccountMember findById(String id);

}