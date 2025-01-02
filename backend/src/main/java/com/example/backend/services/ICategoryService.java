package com.example.backend.services;

import java.util.Optional;

import com.example.backend.models.Category;

public interface ICategoryService {

   Category saveCategory(Category category);

   Optional<Category> getCategoryById(long id);

   Iterable<Category> getAllCategories();

   boolean deleteCategory(long id);

   Category updateCategory(long id, Category category);

}