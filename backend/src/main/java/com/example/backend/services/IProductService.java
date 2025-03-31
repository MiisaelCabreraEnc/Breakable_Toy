package com.example.backend.services;

import java.util.Optional;
import java.util.UUID;

import com.example.backend.models.Metric;
import com.example.backend.models.Product;

public interface IProductService {
   Product createProduct(Product product);

   int getTotalProducts();

   Optional<Product> getProductById(UUID id);

   Iterable<Product> getAllProducts(UUID category, String orderedBy, Boolean availability, int page, String name);

   boolean deleteProduct(UUID id);

   Product updateProduct(UUID id, Product product);

   Product updateProductStock(UUID id, int stock);

   Iterable<Metric> getMetrics();
}
