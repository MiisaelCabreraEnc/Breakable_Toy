package com.example.backend.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class Product implements Cloneable {
   private UUID id; // Cambiado a UUID
   private String name;
   private BigDecimal price;
   private UUID categoryId;
   private LocalDate expirationDate;
   private LocalDateTime creationDate;
   private LocalDateTime updateDate;
   private int stock;

   @Override
   public String toString() {
      return "Product [id=" + id + ", name=" + name + ", price=" + price + ", categoryId=" + categoryId
              + ", expirationDate=" + expirationDate + ", stock=" + stock + "]";
   }

   public UUID getId() {
      return id;
   }

   @Override
   public int hashCode() {
      return Objects.hash(id, name, price, categoryId, expirationDate, stock);
   }

   @Override
   public boolean equals(Object obj) {
      if (this == obj) return true;
      if (obj == null || getClass() != obj.getClass()) return false;
      Product other = (Product) obj;
      return Objects.equals(id, other.id) &&
              Objects.equals(name, other.name) &&
              Objects.equals(price, other.price) &&
              categoryId == other.categoryId &&
              Objects.equals(expirationDate, other.expirationDate) &&
              stock == other.stock;
   }

   public void setId(UUID id) { // Cambiado a UUID
      this.id = id;
   }

   public String getName() {
      return name;
   }

   @Override
   public Object clone() {
      try {
         return super.clone();
      } catch (CloneNotSupportedException e) {
         e.printStackTrace();
      }
      return null;
   }

   public void setName(String name) {
      this.name = name;
   }

   public BigDecimal getPrice() {
      return price;
   }

   public void setPrice(BigDecimal price) {
      this.price = price;
   }

   public LocalDate getExpirationDate() {
      return expirationDate;
   }

   public void setExpirationDate(LocalDate expirationDate) {
      this.expirationDate = expirationDate;
   }

   public int getStock() {
      return stock;
   }

   public UUID getCategoryId() {
      return categoryId;
   }

   public void setCategoryId(UUID categoryId) {
      this.categoryId = categoryId;
   }

   public LocalDateTime getCreationDate() {
      return creationDate;
   }

   public void setCreationDate(LocalDateTime creationDate) {
      this.creationDate = creationDate;
   }

   public LocalDateTime getUpdateDate() {
      return updateDate;
   }

   public void setUpdateDate(LocalDateTime updateDate) {
      this.updateDate = updateDate;
   }

   public void setStock(int stock) {
      this.stock = stock;
   }
}
