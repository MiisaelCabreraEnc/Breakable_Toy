package com.example.backend.models;

import java.math.BigDecimal;
import java.util.UUID;

public class Metric {
    private UUID categoryId;
    private long productsInStock;
    private BigDecimal stockValue;
    private BigDecimal averagePrice;

    public Metric(UUID categoryId, long productsInStock, BigDecimal stockValue, BigDecimal averagePrice){
        this.categoryId = categoryId;
        this.productsInStock = productsInStock;
        this.stockValue = stockValue;
        this.averagePrice = averagePrice;
    }

    public Metric(){
    }

    public UUID getCategory() {
        return categoryId;
    }

    public void setCategory(UUID category) {
        this.categoryId = category;
    }

    public long getProductsInStock() {
        return productsInStock;
    }

    public void setProductsInStock(long productsInStock) {
        this.productsInStock = productsInStock;
    }

    public BigDecimal getStockValue() {
        return stockValue;
    }

    public void setStockValue(BigDecimal stockValue) {
        this.stockValue = stockValue;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }
}
