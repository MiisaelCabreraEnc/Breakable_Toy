package com.example.backend.controllers;

import com.example.backend.models.Metric;
import com.example.backend.models.Product;
import com.example.backend.services.IProductService;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:8080")
public class ProductController {

   private final IProductService productService;

   public ProductController(IProductService productService) {
      this.productService = productService;
   }

   @PostMapping
   public ResponseEntity<Product> createProduct(@RequestBody Product product) {
      Product newProduct = productService.createProduct(product);

      if (newProduct == null)
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

      return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
   }

   @GetMapping("/{id}")
   public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
      Optional<Product> productOptional = productService.getProductById(id);

      if (productOptional.isEmpty())
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      Product product = productOptional.get();
      return new ResponseEntity<>(product, HttpStatus.OK);
   }

   @GetMapping("/total")
   public ResponseEntity<Integer> getProductById() {
      int totalProducts = productService.getTotalProducts();
      return new ResponseEntity<>(totalProducts, HttpStatus.OK);
   }

   @GetMapping
   public ResponseEntity<Iterable<Product>> getAllProducts(
           @RequestParam(required = false) UUID category,
           @RequestParam(required = false) String orderedBy,
           @RequestParam(required = false) Boolean availability,
           @RequestParam(defaultValue = "0") int page,
           @RequestParam(required = false) String name) {

      var result = productService.getAllProducts(category, orderedBy, availability, page, name);

      // Envolver el resultado en un ResponseEntity con el código HTTP adecuado
      return new ResponseEntity<>(result, HttpStatus.OK);
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Boolean> deleteProduct(@PathVariable UUID id) {
      boolean isDeleted = productService.deleteProduct(id);

      if (!isDeleted)
         return new ResponseEntity<>(isDeleted, HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(isDeleted, HttpStatus.OK);
   }

   @PutMapping("/{id}")
   public ResponseEntity<Product> updateProduct(@PathVariable UUID id, @RequestBody Product product) {
      Product updatedProduct = productService.updateProduct(id, product);

      if (updatedProduct == null)
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
   }

   @PostMapping("/{id}/outofstock")
   public ResponseEntity<Product> setProductOutOfStock(@PathVariable UUID id) {
      Product updatedProduct = productService.updateProductStock(id, 0);

      if (updatedProduct == null)
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(updatedProduct, HttpStatus.ACCEPTED);
   }

   @PostMapping("/{id}/instock")
   public ResponseEntity<Product> setProductDefaultValueInStock(@PathVariable UUID id) {
      Product updatedProduct = productService.updateProductStock(id, 10);

      if (updatedProduct == null)
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(updatedProduct, HttpStatus.ACCEPTED);
   }

   @GetMapping("/metrics")
   public  ResponseEntity<Iterable<Metric>> getMetrics(){
      Iterable<Metric> metrics = productService.getMetrics();

      return new ResponseEntity<>(metrics, HttpStatus.ACCEPTED);
   }

}
