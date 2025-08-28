package com.kirana.dto;

public class LowStockDTO {
    private Long productId;
    private String name;
    private int stock;

    public LowStockDTO(Long productId, String name, int stock) {
        this.productId = productId;
        this.name = name;
        this.stock = stock;
    }

    public Long getProductId() { return productId; }
    public String getName() { return name; }
    public int getStock() { return stock; }

    public void setProductId(Long productId) { this.productId = productId; }
    public void setName(String name) { this.name = name; }
    public void setStock(int stock) { this.stock = stock; }
}
