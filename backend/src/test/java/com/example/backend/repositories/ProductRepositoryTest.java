package com.example.backend.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.example.backend.models.Product;

public class ProductRepositoryTest {

   @Test
   public void saveTest() {
      // Given:
      ProductRepository productRepository = new ProductRepository();
      Product product = new Product();

      // When:
      Product savedProduct = productRepository.save(product);

      // Then:
      Assertions.assertNotNull(savedProduct);
      Assertions.assertNotNull(savedProduct.getId());
   }

   @Test
   public void getWhenProductExistsTest() {
      // Given:
      ProductRepository productRepository = new ProductRepository();
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(UUID.randomUUID());
      product.setStock(10);
      Product savedProduct = productRepository.save(product);

      // When:
      Optional<Product> productObtained = productRepository.getById(savedProduct.getId());

      // Then:
      Assertions.assertFalse(productObtained.isEmpty());
      Assertions.assertEquals(savedProduct, productObtained.get());
   }

   @Test
   public void getWhenProductDoesntExistTest() {
      // Given
      ProductRepository productRepository = new ProductRepository();

      // When
      Optional<Product> foundProduct = productRepository.getById(UUID.randomUUID());

      // Then
      Assertions.assertTrue(foundProduct.isEmpty());
   }

   @Test
   public void getAllProductsTest() {
      // Given
      ProductRepository productRepository = new ProductRepository();
      Product product1 = new Product();
      Product product2 = new Product();

      product1.setName("Mesa");
      product1.setExpirationDate(LocalDate.now().plusDays(5));
      product1.setPrice(new BigDecimal("5.01"));
      product1.setCategoryId(UUID.randomUUID());
      product1.setStock(10);

      product2.setName("Mesa2");
      product2.setExpirationDate(LocalDate.now().plusDays(6));
      product2.setPrice(new BigDecimal("6.59"));
      product2.setCategoryId(UUID.randomUUID());
      product2.setStock(5);

      product1.setId(productRepository.save(product1).getId());
      product2.setId(productRepository.save(product2).getId());

      // When
      List<Product> products = new ArrayList<>();
      productRepository.getAll().forEach(products::add);

      // Ordenar los productos por nombre para asegurar consistencia
      products.sort(Comparator.comparing(Product::getName));

      // Then
      assertEquals(product1, products.get(0));
      assertEquals(product2, products.get(1));
   }


   @Test
   public void deleteExistingProductTest() {
      // Given
      ProductRepository productRepository = new ProductRepository();
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(UUID.randomUUID());
      product.setStock(10);
      Product newProduct = productRepository.save(product);

      // When
      productRepository.delete(newProduct.getId());
      Optional<Product> deletedProduct = productRepository.getById(newProduct.getId());

      // Then
      Assertions.assertTrue(deletedProduct.isEmpty());
   }

   @Test
   public void deleteNonExistingProductTest() {
      // Given
      ProductRepository productRepository = new ProductRepository();
      UUID productId = UUID.randomUUID();

      // When
      boolean isDeleted = productRepository.delete(productId);

      // Then
      Assertions.assertFalse(isDeleted);
   }

   @Test
   public void updateProductTest() {
      // Given
      ProductRepository productRepository = new ProductRepository();
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(UUID.randomUUID());
      product.setStock(10);

      Product createdProduct = productRepository.save(product);

      // When
      Product newProduct = new Product();
      newProduct.setName("Mesa2");
      newProduct.setExpirationDate(LocalDate.now().plusDays(6));
      newProduct.setPrice(new BigDecimal("6.59"));
      newProduct.setCategoryId(UUID.randomUUID());
      newProduct.setStock(5);

      Product updatedProduct = productRepository.update(createdProduct.getId(), newProduct);

      // Then
      Assertions.assertAll(
              () -> assertEquals(updatedProduct.getId(), createdProduct.getId()),
              () -> assertNotEquals(updatedProduct.getName(), createdProduct.getName()),
              () -> assertNotEquals(updatedProduct.getExpirationDate(), createdProduct.getExpirationDate()),
              () -> assertNotEquals(updatedProduct.getPrice(), createdProduct.getPrice()),
              () -> assertNotEquals(updatedProduct.getCategoryId(), createdProduct.getCategoryId()),
              () -> assertNotEquals(updatedProduct.getStock(), createdProduct.getStock()),
              () -> assertNotEquals(updatedProduct.getUpdateDate(), createdProduct.getUpdateDate()),
              () -> assertEquals(updatedProduct.getCreationDate(), createdProduct.getCreationDate())
      );
   }
}