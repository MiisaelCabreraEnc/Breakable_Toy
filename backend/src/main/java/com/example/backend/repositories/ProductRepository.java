package com.example.backend.repositories;

import com.example.backend.models.Product;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class ProductRepository {

    private static Map<Long, Product> products = new HashMap<>();
    private static long currentId = 1L;

    public Product save(Product product) {
        product.setId(currentId++);
        products.put(product.getId(), product);

        return product;
    }

    public Optional<Product> getById(Long id) {
        return Optional.ofNullable(products.get(id));
    }

    public Iterable<Product> getAll() {
        return products.values();
    }

    public boolean delete(Long id) {
        return products.remove(id) != null;
    }

    public Product update(Long id, Product product) {
        if (products.containsKey(id)) {
            product.setId(id);
            products.put(id, product);
            return product;
        }
        return null;
    }

    public Product updateStock(Long id, int stock) {
        if (products.containsKey(id)) {
            Product product = products.get(id);
            product.setStock(stock);
            products.put(id, product);
            return product;
        }
        return null;
    }
}
