package com.fpt.medically_be.service;

public interface JwtService {

    String generateToken(String accountId, String email, com.fpt.medically_be.entity.MemberRole role);
}