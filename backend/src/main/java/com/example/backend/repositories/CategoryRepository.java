package com.example.backend.repositories;

import com.example.backend.models.Category;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

@Repository
public class CategoryRepository {

  private final Map<UUID, Category> categories = new HashMap<>();

  public Category save(Category category) {

    Category newCategory = (Category) category.clone();

    UUID id = UUID.randomUUID();
    newCategory.setId(id);

    categories.put(newCategory.getId(), newCategory);

    return newCategory;
  }

  public Optional<Category> getById(UUID id) {
    return Optional.ofNullable(categories.get(id));
  }

  public Iterable<Category> gettAll() {
    return categories.values();
  }

  public boolean delete(UUID id) {
    return categories.remove(id) != null;
  }

  public Category update(UUID id, Category category) {
    if (!categories.containsKey(id))
      return null;

    category.setId(id);
    categories.put(id, category);

    return category;

  }
}
