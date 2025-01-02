package com.example.backend.controllers;

import com.example.backend.models.Product;
import com.example.backend.services.IProductService;
import com.example.backend.services.impl.ProductService.PaginatedResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
      product.setCategoryId(1);
      product.setStock(10);

      Product expectedProduct = new Product();
      expectedProduct.setName("Mesa");
      expectedProduct.setExpirationDate(LocalDate.now().plusDays(5));
      expectedProduct.setCreationDate(LocalDateTime.now());
      expectedProduct.setUpdateDate(LocalDateTime.now());
      expectedProduct.setPrice(new BigDecimal("5.01"));
      expectedProduct.setCategoryId(1);
      expectedProduct.setStock(10);

      Mockito.when(productService.createProduct(product)).thenReturn(expectedProduct);

      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JavaTimeModule());
      objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String jsonProduct = objectMapper.writeValueAsString(expectedProduct);

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
            .andExpect(jsonPath("$.category").value(1))
            .andExpect(jsonPath("$.stock").value(10));
   }

   @Test
   void deleteProductSuccessTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1;

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

      long productId = 1;

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
      product1.setCategoryId(1);
      product1.setStock(10);

      Product product2 = new Product();
      product2.setName("Silla");
      product2.setExpirationDate(LocalDate.now().plusDays(3));
      product2.setPrice(new BigDecimal("3.99"));
      product2.setCategoryId(2);
      product2.setStock(20);

      List<Product> products = Arrays.asList(product1, product2);

      PaginatedResult paginatedResult = new PaginatedResult(products, 2);

      Mockito.when(productService.getAllProducts(null, null, null, 0, null)).thenReturn(paginatedResult);

      // When and Then
      mockMvc.perform(get("/products")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            // Verificamos que "products" contiene 2 elementos
            .andExpect(jsonPath("$.products.size()").value(2))
            // Verificamos el nombre de los productos
            .andExpect(jsonPath("$.products[0].name").value("Mesa"))
            .andExpect(jsonPath("$.products[1].name").value("Silla"))
            // Verificamos que el campo "totalProducts" esté presente y tenga el valor
            // esperado
            .andExpect(jsonPath("$.totalProducts").value(2));

   }

   @Test
   public void getExistingProductByIdTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1;

      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(1);
      product.setStock(10);

      Mockito.when(productService.getProductById(productId)).thenReturn(Optional.of(product));

      // When and Then:
      mockMvc.perform(get("/products/{id}", productId)
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Mesa"))
            .andExpect(jsonPath("$.expirationDate").exists())
            .andExpect(jsonPath("$.price").value(5.01))
            .andExpect(jsonPath("$.category").value(1))
            .andExpect(jsonPath("$.stock").value(10));
   }

   @Test
   public void getNonExistingProductByIdTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1L;

      Mockito.when(productService.getProductById(productId)).thenReturn(Optional.empty());

      // When and Then
      mockMvc.perform(get("/products/{id}", productId)
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
   }

   @Test
   public void updateWhenProductExistsTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1L;
      Product productToUpdate = new Product();
      productToUpdate.setName("Mesa Actualizada");
      productToUpdate.setExpirationDate(LocalDate.now().plusDays(10));
      productToUpdate.setPrice(new BigDecimal("10.01"));
      productToUpdate.setCategoryId(1);
      productToUpdate.setStock(5);

      Product updatedProduct = new Product();
      updatedProduct.setName("Mesa Actualizada");
      updatedProduct.setExpirationDate(LocalDate.now().plusDays(10));
      updatedProduct.setPrice(new BigDecimal("10.01"));
      updatedProduct.setCategoryId(1);
      updatedProduct.setStock(5);

      Mockito.when(productService.updateProduct(productId, productToUpdate)).thenReturn(updatedProduct);

      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JavaTimeModule());
      objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String jsonProduct = objectMapper.writeValueAsString(updatedProduct);

      // When and Then
      mockMvc.perform(put("/products/{id}", productId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonProduct))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Mesa Actualizada"))
            .andExpect(jsonPath("$.expirationDate").exists())
            .andExpect(jsonPath("$.price").value(10.01))
            .andExpect(jsonPath("$.category").value(1))
            .andExpect(jsonPath("$.stock").value(5));
   }

   @Test
   public void updateWhenProductNotFound_Test() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1L;
      Product productToUpdate = new Product();
      productToUpdate.setName("Mesa Actualizada");
      productToUpdate.setExpirationDate(LocalDate.now().plusDays(10));
      productToUpdate.setPrice(new BigDecimal("10.01"));
      productToUpdate.setCategoryId(1);
      productToUpdate.setStock(5);

      Mockito.when(productService.updateProduct(productId, productToUpdate)).thenReturn(null);

      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JavaTimeModule());
      objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String jsonProduct = objectMapper.writeValueAsString(productToUpdate);

      // When and Then
      mockMvc.perform(put("/products/{id}", productId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonProduct))
            .andExpect(status().isNotFound());
   }

   @Test
   public void setProductOutOfStockWhenproductExistsTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1L;
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(1);
      product.setStock(10);

      Product updatedProduct = new Product();
      updatedProduct.setName("Mesa");
      updatedProduct.setExpirationDate(LocalDate.now().plusDays(5));
      updatedProduct.setPrice(new BigDecimal("5.01"));
      updatedProduct.setCategoryId(1);
      updatedProduct.setStock(0);

      Mockito.when(productService.updateProductStock(productId, 0)).thenReturn(updatedProduct);

      // When and Then
      mockMvc.perform(post("/products/{id}/outofstock", productId)
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isAccepted())
            .andExpect(jsonPath("$.stock").value(0));
   }

   public void setProductOutOfStockWhenproductNotFoundTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1;

      Mockito.when(productService.updateProductStock(productId, 0)).thenReturn(null);

      // When and Then
      mockMvc.perform(post("/products/{id}/outofstock", productId)
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
   }

   @Test
   public void setProductDefaultValueInStockWhenproductExistsTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1;
      Product product = new Product();
      product.setName("Mesa");
      product.setExpirationDate(LocalDate.now().plusDays(5));
      product.setPrice(new BigDecimal("5.01"));
      product.setCategoryId(1);
      product.setStock(0);

      Product updatedProduct = new Product();
      updatedProduct.setName("Mesa");
      updatedProduct.setExpirationDate(LocalDate.now().plusDays(5));
      updatedProduct.setPrice(new BigDecimal("5.01"));
      updatedProduct.setCategoryId(1);
      updatedProduct.setStock(10);

      Mockito.when(productService.updateProductStock(productId, 10)).thenReturn(updatedProduct);

      // When and Then
      mockMvc.perform(post("/products/{id}/instock", productId)
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isAccepted())
            .andExpect(jsonPath("$.stock").value(10));
   }

   @Test
   public void setProductDefaultValueInStockWhenproductNotFoundTest() throws Exception {
      // Given
      IProductService productService = Mockito.mock(IProductService.class);
      ProductController productController = new ProductController(productService);
      MockMvc mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

      long productId = 1;

      Mockito.when(productService.updateProductStock(productId, 10)).thenReturn(null);

      // When and Then
      mockMvc.perform(post("/products/{id}/instock", productId)
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
   }

}
