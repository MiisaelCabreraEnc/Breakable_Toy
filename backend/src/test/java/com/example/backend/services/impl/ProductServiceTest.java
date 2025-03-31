package com.example.backend.services.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.example.backend.models.Metric;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.example.backend.models.Product;
import com.example.backend.repositories.ProductRepository;

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
    product.setId(UUID.randomUUID());
    product.setName("Mesa");
    product.setExpirationDate(LocalDate.now().plusDays(5));
    product.setPrice(new BigDecimal("5.01"));
    product.setCategoryId(UUID.randomUUID());
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

    UUID productId = UUID.randomUUID();
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

    UUID productId = UUID.randomUUID();
    Mockito.when(productRepository.getById(productId)).thenReturn(Optional.empty());

    // When
    Optional<Product> requestedProduct = productService.getProductById(productId);

    // Then
    Assertions.assertFalse(requestedProduct.isPresent());
    Mockito.verify(productRepository).getById(productId);
    Mockito.verifyNoMoreInteractions(productRepository);
  }

  @Test
  public void deleteExistingProductTest() {
    // Given
    ProductRepository productRepository = Mockito.mock(ProductRepository.class);
    ProductService productService = new ProductService(productRepository);
    UUID productId = UUID.randomUUID();
    Mockito.when(productRepository.delete(productId)).thenReturn(true);

    // When
    boolean isDeleted = productService.deleteProduct(productId);

    // Then
    Assertions.assertTrue(isDeleted);
    Mockito.verify(productRepository).delete(productId);
    Mockito.verifyNoMoreInteractions(productRepository);
  }

  @Test
  public void updateProductStockTest() {
    // Given
    ProductRepository productRepository = Mockito.mock(ProductRepository.class);
    ProductService productService = new ProductService(productRepository);
    UUID productId = UUID.randomUUID();
    Product product = new Product();
    Optional<Product> optionalProduct = Optional.of(product);
    Product expectedProduct = new Product();
    int stock = 10;
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

  @Test
  public void getTotalProductsTest() {
    // Given
    ProductRepository productRepository = Mockito.mock(ProductRepository.class);
    ProductService productService = new ProductService(productRepository);

    Product product1 = new Product();
    Product product2 = new Product();
    List<Product> productList = List.of(product1, product2);

    Mockito.when(productRepository.getAll()).thenReturn(productList);

    // When
    int totalProducts = productService.getTotalProducts();

    // Then
    Assertions.assertEquals(2, totalProducts);
    Mockito.verify(productRepository).getAll();
    Mockito.verifyNoMoreInteractions(productRepository);
  }

  @Test
  public void getAllProductsWithFiltersTest() {
    // Given
    ProductRepository productRepository = Mockito.mock(ProductRepository.class);
    ProductService productService = new ProductService(productRepository);

    UUID categoryId = UUID.randomUUID();
    Product product1 = new Product();
    product1.setCategoryId(categoryId);
    product1.setName("Product A");
    product1.setStock(5);
    Product product2 = new Product();
    product2.setCategoryId(categoryId);
    product2.setName("Product B");
    product2.setStock(0);

    List<Product> productList = List.of(product1, product2);

    Mockito.when(productRepository.getAll()).thenReturn(productList);

    // When
    Iterable<Product> filteredProducts = productService.getAllProducts(categoryId, "name", true, 1, "Product");

    // Then
    Assertions.assertTrue(filteredProducts.iterator().hasNext());
    Mockito.verify(productRepository).getAll();
    Mockito.verifyNoMoreInteractions(productRepository);
  }

  @Test
  public void updateProductTest() {
    // Given
    ProductRepository productRepository = Mockito.mock(ProductRepository.class);
    ProductService productService = new ProductService(productRepository);
    UUID productId = UUID.randomUUID();
    Product product = new Product();
    product.setId(productId);
    product.setName("Updated Product");
    product.setPrice(new BigDecimal("10.99"));
    product.setStock(50);

    Product updatedProduct = new Product();
    updatedProduct.setId(productId);
    updatedProduct.setName("Updated Product");
    updatedProduct.setPrice(new BigDecimal("10.99"));
    updatedProduct.setStock(50);

    Mockito.when(productRepository.update(productId, product)).thenReturn(updatedProduct);

    // When
    Product result = productService.updateProduct(productId, product);

    // Then
    Assertions.assertNotNull(result);
    Assertions.assertEquals(updatedProduct, result);
    Mockito.verify(productRepository).update(productId, product);
    Mockito.verifyNoMoreInteractions(productRepository);
  }

  @Test
  public void getMetricsTest() {
    // Given
    ProductRepository productRepository = Mockito.mock(ProductRepository.class);
    ProductService productService = new ProductService(productRepository);

    UUID categoryId = UUID.randomUUID();
    Product product1 = new Product();
    product1.setCategoryId(categoryId);
    product1.setStock(10);
    product1.setPrice(new BigDecimal("20.00"));
    Product product2 = new Product();
    product2.setCategoryId(categoryId);
    product2.setStock(5);
    product2.setPrice(new BigDecimal("30.00"));

    List<Product> productList = List.of(product1, product2);

    Mockito.when(productRepository.getAll()).thenReturn(productList);

    // When
    Iterable<Metric> metrics = productService.getMetrics();

    // Then
    Assertions.assertNotNull(metrics);
    Assertions.assertTrue(metrics.iterator().hasNext());
    Mockito.verify(productRepository).getAll();
    Mockito.verifyNoMoreInteractions(productRepository);
  }

  @Test
  public void deleteNonExistingProductTest() {
    // Given
    ProductRepository productRepository = Mockito.mock(ProductRepository.class);
    ProductService productService = new ProductService(productRepository);
    UUID productId = UUID.randomUUID();

    Mockito.when(productRepository.delete(productId)).thenReturn(false);

    // When
    boolean isDeleted = productService.deleteProduct(productId);

    // Then
    Assertions.assertFalse(isDeleted);
    Mockito.verify(productRepository).delete(productId);
    Mockito.verifyNoMoreInteractions(productRepository);
  }

}