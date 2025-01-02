package com.example.backend.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Product implements Cloneable {
   private long id;
   private String name;
   private BigDecimal price;
   private long categoryId;
   private LocalDate expirationDate;
   private LocalDateTime creationDate;
   private LocalDateTime updateDate;

   private int stock;

   @Override
   public String toString() {
      return "Product [id=" + id + ", name=" + name + ", price=" + price + ", categoryId=" + categoryId
            + ", expirationDate=" + expirationDate + ", stock=" + stock + "]";
   }

   public long getId() {
      return id;
   }

   @Override
   public int hashCode() {
      final int prime = 31;
      int result = 1;
      result = prime * result + (int) (id ^ (id >>> 32));
      result = prime * result + ((name == null) ? 0 : name.hashCode());
      result = prime * result + ((price == null) ? 0 : price.hashCode());
      result = prime * result + (int) (categoryId ^ (categoryId >>> 32));
      result = prime * result + ((expirationDate == null) ? 0 : expirationDate.hashCode());
      result = prime * result + stock;
      return result;
   }

   @Override
   public boolean equals(Object obj) {
      if (this == obj)
         return true;
      if (obj == null)
         return false;
      if (getClass() != obj.getClass())
         return false;
      Product other = (Product) obj;
      if (id != other.id)
         return false;
      if (name == null) {
         if (other.name != null)
            return false;
      } else if (!name.equals(other.name))
         return false;
      if (price == null) {
         if (other.price != null)
            return false;
      } else if (!price.equals(other.price))
         return false;
      if (categoryId != other.categoryId)
         return false;
      if (expirationDate == null) {
         if (other.expirationDate != null)
            return false;
      } else if (!expirationDate.equals(other.expirationDate))
         return false;
      if (stock != other.stock)
         return false;
      return true;
   }

   public void setId(long id) {
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

   public long getCategoryId() {
      return categoryId;
   }

   public void setCategoryId(long categoryId) {
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
