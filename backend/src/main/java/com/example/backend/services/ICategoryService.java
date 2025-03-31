package com.example.backend.services;

import java.util.Optional;
import java.util.UUID;

import com.example.backend.models.Category;

public interface ICategoryService {

   Category saveCategory(Category category);

   Optional<Category> getCategoryById(UUID id);

   Iterable<Category> getAllCategories();

   boolean deleteCategory(UUID id);

   Category updateCategory(UUID id, Category category);

}