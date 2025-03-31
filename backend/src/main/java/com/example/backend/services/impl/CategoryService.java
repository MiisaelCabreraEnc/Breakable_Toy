package com.example.backend.services.impl;

import com.example.backend.models.Category;
import com.example.backend.repositories.CategoryRepository;
import com.example.backend.services.ICategoryService;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class CategoryService implements ICategoryService {
   private final CategoryRepository categoryRepository;

   public CategoryService(CategoryRepository categoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   @Override
   public Category saveCategory(Category category) {
      try {
         if (category.getName().isEmpty())
            throw new IllegalArgumentException();

         return categoryRepository.save(category);

      } catch (Exception e) {
         return null;
      }
   }

   @Override
   public Optional<Category> getCategoryById(UUID id) {
      return categoryRepository.getById(id);
   }

   @Override
   public Iterable<Category> getAllCategories() {
      return categoryRepository.gettAll();
   }

   @Override
   public boolean deleteCategory(UUID id) {
      return categoryRepository.delete(id);
   }

   @Override
   public Category updateCategory(UUID id, Category category) {

      try {
         if (category.getName().isEmpty())
            throw new IllegalArgumentException();

         return categoryRepository.update(id, category);

      } catch (Exception e) {
         return null;
      }
   }

}
