package com.example.backend.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.example.backend.models.Product;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.services.impl.ProductService.PaginatedResult;

public class ProductServiceTest {
   @Test
   public void createEmptyProductTest() {
      // Given:
      Product product = new Product();
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);

      // When:
      Product savedProduct = productService.createProduct(product);

      // Then:
      Assertions.assertNull(savedProduct);
      Mockito.verifyNoInteractions(productRepository);

   }

   @Test
   public void createValuedProduct() {
      // Given
      Product product = new Product();
      Product expectedProduct = new Product();

      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(1);
      product.setStock(10);

      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);

      Mockito.when(productRepository.save(product)).thenReturn(expectedProduct);

      // When
      Product savedProduct = productService.createProduct(product);

      // Then
      Assertions.assertSame(savedProduct, expectedProduct);
      Mockito.verify(productRepository).save(product);
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void getExistingProduct() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);

      int productId = 1;
      Product product = new Product();
      Optional<Product> expectedProduct = Optional.of(product);
      Mockito.when(productRepository.getById(productId)).thenReturn(expectedProduct);

      // When
      Optional<Product> requestedProduct = productService.getProductById(productId);

      // Then
      Assertions.assertTrue(requestedProduct.isPresent());
      Mockito.verify(productRepository).getById(productId);
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void getNonExistingProduct() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);

      long productId = 1;
      Mockito.when(productRepository.getById(productId)).thenReturn(Optional.empty());

      // When
      Optional<Product> requestedProduct = productService.getProductById(productId);

      // Then
      Assertions.assertTrue(!requestedProduct.isPresent());
      Mockito.verify(productRepository).getById(productId);
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void getAllProducts() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);
      Product product1 = new Product();
      product1.setId(1);
      product1.setName("Mesa");
      product1.setPrice(BigDecimal.valueOf(100.0));
      product1.setCategoryId(1);
      product1.setStock(10);

      Product product2 = new Product();
      product2.setId(2);
      product2.setName("Silla");
      product2.setPrice(BigDecimal.valueOf(50.0));
      product2.setCategoryId(2);
      product2.setStock(5);

      List<Product> productsList = List.of(product1, product2);
      Mockito.when(productRepository.getAll()).thenReturn(productsList);

      // When
      PaginatedResult result = productService.getAllProducts(null, null, null, 0, null);

      // Then
      // Verificamos que el campo "products" tiene el tamaño correcto
      assertNotNull(result);
      assertEquals(2, result.getProducts().size());
      assertEquals("Mesa", result.getProducts().get(0).getName());
      assertEquals("Silla", result.getProducts().get(1).getName());

      // Verificamos que el total de productos es el correcto
      assertEquals(2, result.getTotalProducts());

      // Verificamos que se haya llamado al repositorio
      Mockito.verify(productRepository).getAll();
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void deleteExistingProductTest() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);
      long productId = 1;
      Mockito.when(productRepository.delete(productId)).thenReturn(true);
      // When
      boolean isDeleted = productService.deleteProduct(productId);
      // Then
      Assertions.assertTrue(isDeleted);
      Mockito.verify(productRepository).delete(productId);
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void deleteNonExistingProductTest() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);
      long productId = 1;
      Mockito.when(productRepository.delete(productId)).thenReturn(false);
      // When
      boolean isDeleted = productService.deleteProduct(productId);
      // Then
      Assertions.assertFalse(isDeleted);
      Mockito.verify(productRepository).delete(productId);
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void updateExistingProductTest() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);
      Product product = new Product();
      Product expectedProduct = new Product();

      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(1);
      product.setStock(10);

      Mockito.when(productRepository.update(1, product)).thenReturn(expectedProduct);
      // When
      Product updatedProduct = productService.updateProduct(1, product);
      // Then
      Assertions.assertSame(updatedProduct, expectedProduct);
      Mockito.verify(productRepository).update(1, product);
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void updateProductWithEmptyValuesTest() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);
      Product product = new Product();

      // When
      Product updatedProduct = productService.updateProduct(1, product);
      // Then
      Assertions.assertTrue(updatedProduct == null);
      Mockito.verifyNoInteractions(productRepository);
   }

   @Test
   public void updateNonExistingProductTest() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(1);
      product.setStock(10);

      Mockito.when(productRepository.update(1, product)).thenReturn(null);
      // When
      Product updatedProduct = productService.updateProduct(1, product);
      // Then
      Assertions.assertTrue(updatedProduct == null);
      Mockito.verify(productRepository).update(1, product);
      Mockito.verifyNoMoreInteractions(productRepository);
   }

   @Test
   public void updateProductStockTest() {
      // Given
      ProductRepository productRepository = Mockito.mock(ProductRepository.class);
      ProductService productService = new ProductService(productRepository);
      Product product = new Product();
      Optional<Product> optionalProduct = Optional.of(product);
      Product expectedProduct = new Product();
      int stock = 10;
      long productId = 1;
      expectedProduct.setId(productId);

      Mockito.when(productService.getProductById(productId)).thenReturn(optionalProduct);
      Mockito.when(productRepository.update(productId, product)).thenReturn(expectedProduct);
      // When
      Product updatedProduct = productService.updateProductStock(productId, stock);
      // Then
      Assertions.assertNotEquals(updatedProduct.getStock(), product.getStock());
      Mockito.verify(productRepository).getById(productId);
      Mockito.verify(productRepository).update(productId, product);
      Mockito.verifyNoMoreInteractions(productRepository);
   }
}
