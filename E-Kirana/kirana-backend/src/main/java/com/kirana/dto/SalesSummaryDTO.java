package com.kirana.dto;

import java.time.LocalDateTime;

public class SalesSummaryDTO {
    private long totalOrders;
    private double totalRevenue;
    private LocalDateTime from;
    private LocalDateTime to;

    public SalesSummaryDTO(long totalOrders, double totalRevenue, LocalDateTime from, LocalDateTime to) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.from = from;
        this.to = to;
    }

    public long getTotalOrders() { return totalOrders; }
    public double getTotalRevenue() { return totalRevenue; }
    public LocalDateTime getFrom() { return from; }
    public LocalDateTime getTo() { return to; }

    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
    public void setFrom(LocalDateTime from) { this.from = from; }
    public void setTo(LocalDateTime to) { this.to = to; }
}
