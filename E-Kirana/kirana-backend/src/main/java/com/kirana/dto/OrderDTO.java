package com.kirana.dto;

import com.kirana.model.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {

    private Long id;
    private String customerName;
    private List<OrderItemDTO> orderItems;
    private double totalPrice;
    private OrderStatus status;
    private String paymentMethod;
    private LocalDateTime orderDate;

    public OrderDTO(Long id, String customerName, List<OrderItemDTO> orderItems, double totalPrice, OrderStatus status, String paymentMethod, LocalDateTime orderDate) {
        this.id = id;
        this.customerName = customerName;
        this.orderItems = orderItems;
        this.totalPrice = totalPrice;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public List<OrderItemDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDTO> orderItems) { this.orderItems = orderItems; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}
