package com.example.backend.models;

import java.util.Objects;
import java.util.UUID;

public class Category implements Cloneable {

   private UUID id;
   private String name;

   public UUID getId() {
      return id;
   }

   public void setId(UUID id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   @Override
   public boolean equals(Object o) {
      if (o == null || getClass() != o.getClass()) return false;
      Category category = (Category) o;
      return Objects.equals(id, category.id) && Objects.equals(name, category.name);
   }

   @Override
   public int hashCode() {
      return Objects.hash(id, name);
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

   @Override
   public String toString() {
      return "Category [id=" + id + ", name=" + name + "]";
   }

}
