package com.example.backend.repositories;

import com.example.backend.models.Category;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

@Repository
public class CategoryRepository {

   private Map<Long, Category> categories = new HashMap<>();
   private AtomicLong currentId = new AtomicLong(1);

   public Category save(Category category) {

      Category newCategory = (Category) category.clone();

      newCategory.setId(currentId.getAndIncrement());
      categories.put(newCategory.getId(), newCategory);

      return newCategory;
   }

   public Optional<Category> getById(long id) {
      return Optional.ofNullable(categories.get(id));
   }

   public Iterable<Category> gettAll() {
      return categories.values();
   }

   public boolean delete(long id) {
      return categories.remove(id) != null;
   }

   public Category update(long id, Category category) {
      if (!categories.containsKey(id))
         return null;

      category.setId(id);
      categories.put(id, category);

      return category;

   }
}
