package com.example.backend.services;

import com.example.backend.models.Product;
import com.example.backend.repositories.ProductRepository;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private ProductRepository productRepository;

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.getById(id);
    }

    public Iterable<Product> getAllProducts() {
        return productRepository.getAll();
    }

    public boolean deleteProduct(Long id) {
        return productRepository.delete(id);
    }

    public Product updateProduct(Long id, Product product) {
        return productRepository.update(id, product);
    }

    public Product updateProductStock(Long id, int stock) {
        Product product = productRepository.getById(id).get();
        if (product != null) {
            product.setStock(stock);
            productRepository.update(id, product);
            return product;
        }

        return null;
    }

}
