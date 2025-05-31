package com.fpt.medically_be.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "member")
@Data
public class AccountMember {

    @Id
    private String id;

    private String password;

    private String email;


@Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private MemberRole role;
}