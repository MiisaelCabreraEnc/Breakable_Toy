package com.example.backend.services.impl;

import com.example.backend.models.Product;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.services.IProductService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class ProductService implements IProductService {
   private ProductRepository productRepository;

   public ProductService(ProductRepository productRepository) {

      this.productRepository = productRepository;
   }

   public Product createProduct(Product product) {
      // UUID.randomUUID().toString();
      try {

         if (product.getName() == null)
            throw new IllegalArgumentException("Name cannot be empty");

         if (product.getName().length() > 120 && product.getName().length() < 1)
            throw new IllegalArgumentException("Name must have between 1 and 120 characters");

         if (product.getPrice() == null)
            throw new IllegalArgumentException("Price cannot be empty");

         if (product.getPrice().compareTo(BigDecimal.ZERO) == -1)
            throw new IllegalArgumentException("Price must be greater or equal to 0");

         if (product.getStock() < 0)
            throw new IllegalArgumentException("Stock must be greater or equal to 0");

         return productRepository.save(product);

      } catch (Exception e) {
         return null;
      }
   }

   public Optional<Product> getProductById(long id) {

      return productRepository.getById(id);
   }

   public PaginatedResult getAllProducts(Long category, String orderedBy, Boolean availability, int page, String name) {
      List<Product> products = new ArrayList<>();
      productRepository.getAll().forEach(products::add);

      if (category != null) {
         products = products.stream()
               .filter(p -> p.getCategoryId() == category)
               .collect(Collectors.toList());
      }

      if (name != null && !name.isEmpty()) {
         products = products.stream()
               .filter(p -> p.getName().toLowerCase().contains(name.toLowerCase()))
               .collect(Collectors.toList());
      }

      if (availability != null) {
         products = products.stream()
               .filter(p -> (availability && p.getStock() > 0) || (!availability && p.getStock() == 0))
               .collect(Collectors.toList());
      }

      if ("price".equalsIgnoreCase(orderedBy)) {
         products.sort(Comparator.comparing(Product::getPrice, Comparator.naturalOrder()));
      } else if ("name".equalsIgnoreCase(orderedBy)) {
         products.sort(Comparator.comparing(Product::getName));
      } else if ("expirationDate".equalsIgnoreCase(orderedBy)) {
         products.sort(Comparator.comparing(Product::getExpirationDate));
      } else if ("category".equalsIgnoreCase(orderedBy)) {
         products.sort(Comparator.comparingLong(Product::getCategoryId));
      } else if ("stock".equalsIgnoreCase(orderedBy)) {
         products.sort(Comparator.comparingInt(Product::getStock));
      }

      int pageSize = 10;
      int start = page * pageSize;
      int end = Math.min(start + pageSize, products.size());

      List<Product> paginatedProducts = products.subList(start, end);

      return new PaginatedResult(paginatedProducts, products.size());
   }

   public boolean deleteProduct(long id) {
      return productRepository.delete(id);
   }

   public Product updateProduct(long id, Product product) {

      try {

         if (product.getName() == null)
            throw new NullPointerException("Name cannot be empty");

         if (product.getName().length() > 120 && product.getName().length() < 1)
            throw new IllegalArgumentException("Name must have between 1 and 120 characters");

         if (product.getPrice() == null)
            throw new NullPointerException("Price cannot be empty");

         if (product.getPrice().compareTo(BigDecimal.ZERO) == -1)
            throw new IllegalArgumentException("Price must be greater or equal to 0");

         if (product.getStock() < 0)
            throw new IllegalArgumentException("Stock must be greater or equal to 0");

         return productRepository.update(id, product);

      } catch (Exception e) {
         return null;
      }
   }

   public synchronized Product updateProductStock(long id, int stock) {
      Optional<Product> product = productRepository.getById(id);

      if (!product.isPresent())
         return null;

      product.get().setStock(stock);
      return productRepository.update(id, product.get());

   }

   public static class PaginatedResult {
      private final List<Product> products;
      private final int totalProducts;

      public PaginatedResult(List<Product> products, int totalProducts) {
         this.products = products;
         this.totalProducts = totalProducts;
      }

      public List<Product> getProducts() {
         return products;
      }

      public int getTotalProducts() {
         return totalProducts;
      }
   }

}
