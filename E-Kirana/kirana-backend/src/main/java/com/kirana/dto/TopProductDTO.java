package com.kirana.dto;

public class TopProductDTO {
    private Long productId;
    private String name;
    private long quantitySold;
    private double revenue;

    public TopProductDTO(Long productId, String name, long quantitySold, double revenue) {
        this.productId = productId;
        this.name = name;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
    }

    public Long getProductId() { return productId; }
    public String getName() { return name; }
    public long getQuantitySold() { return quantitySold; }
    public double getRevenue() { return revenue; }

    public void setProductId(Long productId) { this.productId = productId; }
    public void setName(String name) { this.name = name; }
    public void setQuantitySold(long quantitySold) { this.quantitySold = quantitySold; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
}
