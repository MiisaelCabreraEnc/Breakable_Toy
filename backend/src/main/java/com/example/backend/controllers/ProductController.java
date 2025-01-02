package com.example.backend.controllers;

import com.example.backend.models.Product;
import com.example.backend.services.IProductService;
import com.example.backend.services.impl.ProductService.PaginatedResult;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:8080")
public class ProductController {

   private IProductService productService;

   public ProductController(IProductService productService) {
      this.productService = productService;
   }

   @PostMapping
   public ResponseEntity<Product> createProduct(@RequestBody Product product) {
      Product newProduct = productService.createProduct(product);

      if (product == null)
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

      return new ResponseEntity<>(newProduct, HttpStatus.CREATED);

   }

   @GetMapping("/{id}")
   public ResponseEntity<Product> getProductById(@PathVariable long id) {

      Optional<Product> productOptional = productService.getProductById(id);

      if (!productOptional.isPresent())
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      Product product = productOptional.get();
      return new ResponseEntity<>(product, HttpStatus.OK);
   }

   @GetMapping
   public ResponseEntity<PaginatedResult> getAllProducts(
         @RequestParam(required = false) Long category,
         @RequestParam(required = false) String orderedBy,
         @RequestParam(required = false) Boolean availability,
         @RequestParam(defaultValue = "0") int page,
         @RequestParam(required = false) String name) {

      var result = productService.getAllProducts(category, orderedBy, availability, page, name);
      return new ResponseEntity<>(result, HttpStatus.OK);
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Boolean> deleteProduct(@PathVariable long id) {

      boolean isDeleted = productService.deleteProduct(id);

      if (!isDeleted)
         return new ResponseEntity<>(isDeleted, HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(isDeleted, HttpStatus.OK);
   }

   @PutMapping("/{id}")
   public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
      Product updatedProduct = productService.updateProduct(id, product);

      if (updatedProduct == null)
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
   }

   @PostMapping("/{id}/outofstock")
   public ResponseEntity<Product> setProductOutOfStock(@PathVariable long id) {
      Product updatedProduct = productService.updateProductStock(id, 0);

      if (updatedProduct == null)
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(updatedProduct, HttpStatus.ACCEPTED);
   }

   @PostMapping("/{id}/instock")
   public ResponseEntity<Product> setProductDefaultValueInStock(@PathVariable long id) {
      Product updatedProduct = productService.updateProductStock(id, 10);

      if (updatedProduct == null)
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(updatedProduct, HttpStatus.ACCEPTED);
   }

}
