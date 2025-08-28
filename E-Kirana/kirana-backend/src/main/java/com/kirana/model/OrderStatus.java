package com.kirana.model;

public enum OrderStatus {
    PENDING,     // Order placed but not confirmed
    CONFIRMED,   // Order accepted/processed
    SHIPPED,     // Order shipped
    DELIVERED,   // Order delivered to customer
    CANCELLED    // Order cancelled
}
