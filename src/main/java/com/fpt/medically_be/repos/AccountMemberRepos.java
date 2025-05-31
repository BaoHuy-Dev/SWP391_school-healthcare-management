package com.fpt.medically_be.repos;

import com.fpt.medically_be.entity.AccountMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AccountMemberRepos extends JpaRepository<AccountMember, String> {
    Optional<AccountMember> findAccountMemberByEmail(String email);

    Optional<AccountMember> findAccountMemberById(String id);

}