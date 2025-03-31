package com.example.backend.services.impl;

import com.example.backend.models.Metric;
import com.example.backend.models.Product;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.services.IProductService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class ProductService implements IProductService {
  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public Product createProduct(Product product) {
    try {
      if (product.getName() == null)
        throw new IllegalArgumentException("Name cannot be empty");

      if (product.getName().length() > 120 || product.getName().isEmpty())
        throw new IllegalArgumentException("Name must have between 1 and 120 characters");

      if (product.getPrice() == null)
        throw new IllegalArgumentException("Price cannot be empty");

      if (product.getPrice().compareTo(BigDecimal.ZERO) < 0)
        throw new IllegalArgumentException("Price must be greater or equal to 0");

      if (product.getStock() < 0)
        throw new IllegalArgumentException("Stock must be greater or equal to 0");

      return productRepository.save(product);
    } catch (Exception e) {
      return null;
    }
  }

  public int getTotalProducts() {
    List<Product> products = new ArrayList<>();
    productRepository.getAll().forEach(products::add);
    return products.size();
  }

  // Cambiar long por UUID
  public Optional<Product> getProductById(UUID id) {
    return productRepository.getById(id);
  }

  // Cambiar long por UUID en delete y update
  public Iterable<Product> getAllProducts(UUID category, String orderedBy, Boolean availability, int page,
      String name) {
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

    if (orderedBy != null)
      switch (orderedBy.toLowerCase()) {
        case "price":
          products.sort(Comparator.comparing(Product::getPrice, Comparator.nullsLast(Comparator.naturalOrder())));
          break;
        case "name":
          products.sort(Comparator.comparing(Product::getName, Comparator.nullsLast(Comparator.naturalOrder())));
          break;
        case "expirationdate":
          products
              .sort(Comparator.comparing(Product::getExpirationDate, Comparator.nullsLast(Comparator.naturalOrder())));
          break;
        case "category":
          products.sort(Comparator.comparing(Product::getCategoryId, Comparator.nullsLast(Comparator.naturalOrder())));
          break;
        case "stock":
          products.sort(Comparator.comparingInt(Product::getStock));
          break;
      }

    if (page > 0)
      page--;

    int pageSize = 10;
    int start = page * pageSize;
    int end = Math.min(start + pageSize, products.size());

    return products.subList(start, end);
  }

  // Cambiar long por UUID en el delete
  public boolean deleteProduct(UUID id) {
    return productRepository.delete(id);
  }

  // Cambiar long por UUID en el update
  public Product updateProduct(UUID id, Product product) {
    try {
      if (product.getName() == null)
        throw new NullPointerException("Name cannot be empty");

      if (product.getName().length() > 120 || product.getName().isEmpty())
        throw new IllegalArgumentException("Name must have between 1 and 120 characters");

      if (product.getPrice() == null)
        throw new NullPointerException("Price cannot be empty");

      if (product.getPrice().compareTo(BigDecimal.ZERO) < 0)
        throw new IllegalArgumentException("Price must be greater or equal to 0");

      if (product.getStock() < 0)
        throw new IllegalArgumentException("Stock must be greater or equal to 0");

      return productRepository.update(id, product);
    } catch (Exception e) {
      return null;
    }
  }

  // Cambiar long por UUID en el updateStock
  public synchronized Product updateProductStock(UUID id, int stock) {
    Optional<Product> product = productRepository.getById(id);

    if (product.isEmpty())
      return null;

    product.get().setStock(stock);
    return productRepository.update(id, product.get());
  }

  public Iterable<Metric> getMetrics() {
    List<Product> products = new ArrayList<>();
    productRepository.getAll().forEach(products::add);

    // Agrupar los productos por categoría
    Map<UUID, List<Product>> productsByCategory = products.stream()
        .collect(Collectors.groupingBy(Product::getCategoryId));

    List<Metric> metrics = new ArrayList<>();

    for (Map.Entry<UUID, List<Product>> entry : productsByCategory.entrySet()) {
      UUID categoryId = entry.getKey();
      List<Product> categoryProducts = entry.getValue();

      // Buscar la categoría directamente en la lista de categorías

      // Calcular los valores requeridos
      int productsInStock = categoryProducts.stream()
          .mapToInt(Product::getStock)
          .sum();

      BigDecimal stockValue = categoryProducts.stream()
          .map(product -> product.getPrice().multiply(BigDecimal.valueOf(product.getStock())))
          .reduce(BigDecimal.ZERO, BigDecimal::add);

      BigDecimal averagePrice = BigDecimal.ZERO;
      if (productsInStock > 0) {
        averagePrice = stockValue.divide(BigDecimal.valueOf(productsInStock), 2, RoundingMode.HALF_UP);
      }

      // Crear el DTO de las métricas
      Metric categoryMetrics = new Metric(
          categoryId,
          productsInStock,
          stockValue,
          averagePrice);

      // Añadir a la lista de métricas
      metrics.add(categoryMetrics);

    }

    return metrics;
  }

}
