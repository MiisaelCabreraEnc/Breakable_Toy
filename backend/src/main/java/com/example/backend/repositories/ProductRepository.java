package com.example.backend.repositories;

import com.example.backend.models.Product;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

@Repository
public class ProductRepository {

   private Map<Long, Product> products = new HashMap<>();
   private AtomicLong currentId = new AtomicLong(1);

   public Product save(Product product) {

      Product newProduct = (Product) product.clone();
      newProduct.setCreationDate(LocalDateTime.now());
      newProduct.setUpdateDate(LocalDateTime.now());

      newProduct.setId(currentId.getAndIncrement());
      products.put(newProduct.getId(), newProduct);

      return newProduct;
   }

   public Optional<Product> getById(long id) {
      return Optional.ofNullable(products.get(id));
   }

   public Iterable<Product> getAll() {
      return products.values();
   }

   public boolean delete(long id) {
      return products.remove(id) != null;
   }

   public Product update(long id, Product product) {
      if (!products.containsKey(id))
         return null;

      product.setCreationDate(products.get(id).getCreationDate());
      product.setUpdateDate(LocalDateTime.now());

      product.setId(id);
      products.put(id, product);

      return product;

   }

}
