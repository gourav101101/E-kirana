package com.kirana.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    USER,
    CUSTOMER,
    ADMIN;

    // Helpful for JSON deserialization (accepts case-insensitive values)
    @JsonCreator
    public static Role from(String value) {
        if (value == null){
            return USER;
        }
        return Role.valueOf(value.trim().toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
