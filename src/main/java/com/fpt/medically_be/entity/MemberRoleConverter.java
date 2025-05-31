package com.fpt.medically_be.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MemberRoleConverter implements AttributeConverter<MemberRole, Integer> {

    @Override
    public Integer convertToDatabaseColumn(MemberRole attribute) {
        if (attribute == null) {
            return null;
        }

        return switch (attribute) {
            case ADMIN -> 1;
            case NURSE -> 2;
            case PARENT -> 3;
        };
    }

    @Override
    public MemberRole convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }

        return switch (dbData) {
            case 1 -> MemberRole.ADMIN;
            case 2 -> MemberRole.NURSE;
            case 3 -> MemberRole.PARENT;
            default -> throw new IllegalArgumentException("Unknown database value: " + dbData);
        };
    }
}