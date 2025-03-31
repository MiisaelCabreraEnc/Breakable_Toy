package com.example.backend.repositories;

import com.example.backend.models.Product;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class ProductRepository {

   // Cambiar Map<Long, Product> a Map<UUID, Product>
   private final Map<UUID, Product> products = new HashMap<>();

   public Product save(Product product) {
      Product newProduct = (Product) product.clone();
      newProduct.setCreationDate(LocalDateTime.now());
      newProduct.setUpdateDate(LocalDateTime.now());

      // Generar un nuevo UUID para el ID del producto
      UUID id = UUID.randomUUID();
      newProduct.setId(id);

      products.put(id, newProduct);
      return newProduct;
   }

   // Cambiar el método para recibir y devolver UUID en lugar de long
   public Optional<Product> getById(UUID id) {
      return Optional.ofNullable(products.get(id));
   }

   public Iterable<Product> getAll() {
      return products.values();
   }

   // Cambiar el método para recibir UUID en lugar de long
   public boolean delete(UUID id) {
      return products.remove(id) != null;
   }

   public Product update(UUID id, Product product) {
      if (!products.containsKey(id))
         return null;

      product.setCreationDate(products.get(id).getCreationDate());
      product.setUpdateDate(LocalDateTime.now());
      product.setId(id);

      products.put(id, product);
      return product;
   }
}
