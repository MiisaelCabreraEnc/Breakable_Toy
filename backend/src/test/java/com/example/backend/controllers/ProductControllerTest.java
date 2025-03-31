package com.example.backend.controllers;

import com.example.backend.models.Metric;
import com.example.backend.models.Product;
import com.example.backend.services.IProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class ProductControllerTest {

   @Test
   public void createProductTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(UUID.randomUUID());
      product.setStock(10);

      Product expectedProduct = new Product();
      expectedProduct.setName("Mesa");
      expectedProduct.setExpirationDate(LocalDate.now().plusDays(5));
      expectedProduct.setCreationDate(LocalDateTime.now());
      expectedProduct.setUpdateDate(LocalDateTime.now());
      expectedProduct.setPrice(new BigDecimal("5.01"));
      expectedProduct.setCategoryId(UUID.randomUUID());
      expectedProduct.setStock(10);

      Mockito.when(productService.createProduct(Mockito.any(Product.class))).thenReturn(expectedProduct);

      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JavaTimeModule());
      objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String jsonProduct = objectMapper.writeValueAsString(product);

      // When and then
      mockMvc.perform(post("/products")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(jsonProduct))
              .andExpect(status().isCreated())
              .andExpect(jsonPath("$.name").value("Mesa"))
              .andExpect(jsonPath("$.expirationDate").exists())
              .andExpect(jsonPath("$.creationDate").exists())
              .andExpect(jsonPath("$.updateDate").exists())
              .andExpect(jsonPath("$.price").value(5.01))
              .andExpect(jsonPath("$.categoryId").value(Matchers.matchesRegex("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")))
              .andExpect(jsonPath("$.stock").value(10));
   }

   @Test
   public void getProductByIdSuccessTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();
      Product product = new Product();
      product.setId(productId);
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(UUID.randomUUID());
      product.setStock(10);

      Mockito.when(productService.getProductById(productId)).thenReturn(Optional.of(product));

      // When and Then
      mockMvc.perform(get("/products/{id}", productId)
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.name").value("Mesa"))
              .andExpect(jsonPath("$.stock").value(10));
   }

   @Test
   public void getProductByIdNotFoundTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();

      Mockito.when(productService.getProductById(productId)).thenReturn(Optional.empty());

      // When and Then
      mockMvc.perform(get("/products/{id}", productId)
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isNotFound());
   }


   @Test
   void deleteProductSuccessTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();

      Mockito.when(productService.deleteProduct(productId)).thenReturn(true);

      mockMvc.perform(delete("/products/{id}", productId)
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isOk())
              .andExpect(content().string("true"));
   }

   @Test
   void deleteProductNotFoundTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();

      Mockito.when(productService.deleteProduct(productId)).thenReturn(false);

      // When and then
      mockMvc.perform(delete("/products/{id}", productId)
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isNotFound())
              .andExpect(content().string("false"));
   }

   @Test
   public void getAllProductsTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      Product product1 = new Product();
      product1.setName("Mesa");
      product1.setExpirationDate(LocalDate.now().plusDays(5));
      product1.setPrice(new BigDecimal("5.01"));
      product1.setCategoryId(UUID.randomUUID());
      product1.setStock(10);

      Product product2 = new Product();
      product2.setName("Silla"); // Se asigna correctamente a product2
      product2.setExpirationDate(LocalDate.now().plusDays(3));
      product2.setPrice(new BigDecimal("3.99"));
      product2.setCategoryId(UUID.randomUUID());
      product2.setStock(30);

      List<Product> products = Arrays.asList(product1, product2);

      Mockito.when(productService.getAllProducts(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.anyInt(), Mockito.any()))
              .thenReturn(products);

      // When and Then
      mockMvc.perform(get("/products")
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$[0].name").value("Mesa"))
              .andExpect(jsonPath("$[1].name").value("Silla"));
   }

   @Test
   public void updateProductTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(UUID.randomUUID());
      product.setStock(10);

      Product updatedProduct = new Product();
      updatedProduct.setName("Mesa Actualizada");
      updatedProduct.setExpirationDate(LocalDate.now().plusDays(3));
      updatedProduct.setPrice(new BigDecimal("5.99"));
      updatedProduct.setCategoryId(UUID.randomUUID());
      updatedProduct.setStock(15);

      Mockito.when(productService.updateProduct(Mockito.any(UUID.class), Mockito.any(Product.class)))
              .thenReturn(updatedProduct);

      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JavaTimeModule());
      objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String jsonProduct = objectMapper.writeValueAsString(product);

      // When and Then
      mockMvc.perform(put("/products/{id}", productId)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(jsonProduct))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.name").value("Mesa Actualizada"))
              .andExpect(jsonPath("$.price").value(5.99))
              .andExpect(jsonPath("$.stock").value(15));
   }

   @Test
   public void updateProductNotFoundTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(UUID.randomUUID());
      product.setStock(10);

      Mockito.when(productService.updateProduct(Mockito.any(UUID.class), Mockito.any(Product.class)))
              .thenReturn(null);

      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JavaTimeModule());
      objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String jsonProduct = objectMapper.writeValueAsString(product);

      // When and Then
      mockMvc.perform(put("/products/{id}", productId)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(jsonProduct))
              .andExpect(status().isNotFound());
   }

   @Test
   public void setProductOutOfStockTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();
      Product updatedProduct = new Product();
      updatedProduct.setStock(0); // Producto sin stock

      Mockito.when(productService.updateProductStock(productId, 0)).thenReturn(updatedProduct);

      // When and Then
      mockMvc.perform(post("/products/{id}/outofstock", productId)
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isAccepted())
              .andExpect(jsonPath("$.stock").value(0));
   }

   @Test
   public void setProductInStockTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      UUID productId = UUID.randomUUID();
      Product updatedProduct = new Product();
      updatedProduct.setStock(10); // Producto con stock

      Mockito.when(productService.updateProductStock(productId, 10)).thenReturn(updatedProduct);

      // When and Then
      mockMvc.perform(post("/products/{id}/instock", productId)
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isAccepted())
              .andExpect(jsonPath("$.stock").value(10));
   }




   @Test
   public void getMetricsTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      Metric metric1 = new Metric();
      Metric metric2 = new Metric();
      List<Metric> metrics = Arrays.asList(metric1, metric2);

      Mockito.when(productService.getMetrics()).thenReturn(metrics);

      // When and Then
      mockMvc.perform(get("/products/metrics")
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(status().isAccepted())
              .andExpect(jsonPath("$").isArray())
              .andExpect(jsonPath("$.length()").value(2));
   }


}
