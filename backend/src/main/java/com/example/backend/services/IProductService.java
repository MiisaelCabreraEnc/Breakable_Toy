package com.example.backend.services;

import java.util.Optional;

import com.example.backend.models.Product;
import com.example.backend.services.impl.ProductService.PaginatedResult;

public interface IProductService {
   Product createProduct(Product product);

   Optional<Product> getProductById(long id);

   PaginatedResult getAllProducts(Long category, String orderedBy, Boolean availability, int page, String name);

   boolean deleteProduct(long id);

   Product updateProduct(long id, Product product);

   Product updateProductStock(long id, int stock);
}
