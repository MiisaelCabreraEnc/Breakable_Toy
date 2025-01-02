package com.example.backend.controllers;

import com.example.backend.models.Category;
import com.example.backend.services.ICategoryService;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:8080")
public class CategoryController {
   private ICategoryService categoryService;

   public CategoryController(ICategoryService categoryService) {
      this.categoryService = categoryService;
   }

   @PostMapping
   public ResponseEntity<Category> createCategory(@RequestBody Category category) {
      Category newCategory = categoryService.saveCategory(category);

      if (category == null)
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

      return new ResponseEntity<>(newCategory, HttpStatus.CREATED);

   }

   @GetMapping("/{id}")
   public ResponseEntity<Category> getCategoryById(@PathVariable long id) {

      Optional<Category> categoryOptional = categoryService.getCategoryById(id);

      if (!categoryOptional.isPresent())
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      Category Category = categoryOptional.get();
      return new ResponseEntity<>(Category, HttpStatus.OK);
   }

   @GetMapping
   public Iterable<Category> getAllCategorys() {
      return categoryService.getAllCategories();
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Boolean> deleteCategory(@PathVariable long id) {

      boolean isDeleted = categoryService.deleteCategory(id);

      if (!isDeleted)
         return new ResponseEntity<>(isDeleted, HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(isDeleted, HttpStatus.OK);
   }

   @PutMapping("/{id}")
   public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category Category) {
      Category updatedCategory = categoryService.updateCategory(id, Category);

      if (updatedCategory == null)
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);

      return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
   }
}
