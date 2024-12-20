package com.example.backend.controllers;

import com.example.backend.models.Product;
import com.example.backend.services.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/products")
public class ProductController {

    ProductService productService = new ProductService();

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping
    public Iterable<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @DeleteMapping("/{id}")
    public boolean deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @PostMapping("/{id}/outofstock")
    public Product outOfStock(@PathVariable Long id) {
        return productService.outOfStock(id);
    }

    @PostMapping("/{id}/instock")
    public Product inStock(@PathVariable Long id) {
        return productService.inStock(id);
    }

}
