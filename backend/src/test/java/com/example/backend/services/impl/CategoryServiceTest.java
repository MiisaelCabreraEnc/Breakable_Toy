package com.example.backend.services.impl;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.example.backend.models.Category;
import com.example.backend.repositories.CategoryRepository;

public class CategoryServiceTest {

    @Test
    public void saveCategoryWithEmptyNameTest() {
        // Given:
        Category category = new Category();
        category.setName(""); // Empty name
        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);

        // When:
        Category savedCategory = categoryService.saveCategory(category);

        // Then:
        assertNull(savedCategory);
        Mockito.verifyNoInteractions(categoryRepository);
    }

    @Test
    public void saveCategoryWithValidNameTest() {
        // Given:
        Category category = new Category();
        category.setName("Electronics");
        Category expectedCategory = new Category();
        expectedCategory.setId(UUID.randomUUID());
        expectedCategory.setName("Electronics");

        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);

        Mockito.when(categoryRepository.save(category)).thenReturn(expectedCategory);

        // When:
        Category savedCategory = categoryService.saveCategory(category);

        // Then:
        assertSame(savedCategory, expectedCategory);
        Mockito.verify(categoryRepository).save(category);
        Mockito.verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    public void getCategoryByIdTest() {
        // Given:
        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);
        UUID categoryId = UUID.randomUUID();
        Category category = new Category();
        category.setId(categoryId);

        Optional<Category> expectedCategory = Optional.of(category);
        Mockito.when(categoryRepository.getById(categoryId)).thenReturn(expectedCategory);

        // When:
        Optional<Category> requestedCategory = categoryService.getCategoryById(categoryId);

        // Then:
        assertTrue(requestedCategory.isPresent());
        assertSame(requestedCategory.get(), category);
        Mockito.verify(categoryRepository).getById(categoryId);
        Mockito.verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    public void getCategoryByIdNotFoundTest() {
        // Given:
        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);
        UUID categoryId = UUID.randomUUID();

        Mockito.when(categoryRepository.getById(categoryId)).thenReturn(Optional.empty());

        // When:
        Optional<Category> requestedCategory = categoryService.getCategoryById(categoryId);

        // Then:
        assertFalse(requestedCategory.isPresent());
        Mockito.verify(categoryRepository).getById(categoryId);
        Mockito.verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    public void deleteCategoryTest() {
        // Given:
        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);
        UUID categoryId = UUID.randomUUID();
        Mockito.when(categoryRepository.delete(categoryId)).thenReturn(true);

        // When:
        boolean isDeleted = categoryService.deleteCategory(categoryId);

        // Then:
        assertTrue(isDeleted);
        Mockito.verify(categoryRepository).delete(categoryId);
        Mockito.verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    public void updateCategoryWithEmptyNameTest() {
        // Given:
        UUID categoryId = UUID.randomUUID();
        Category category = new Category();
        category.setName(""); // Empty name

        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);

        // When:
        Category updatedCategory = categoryService.updateCategory(categoryId, category);

        // Then:
        assertNull(updatedCategory);
        Mockito.verifyNoInteractions(categoryRepository);
    }

    @Test
    public void updateCategoryWithValidNameTest() {
        // Given:
        UUID categoryId = UUID.randomUUID();
        Category category = new Category();
        category.setName("Furniture");

        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);
        expectedCategory.setName("Furniture");

        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);

        Mockito.when(categoryRepository.update(categoryId, category)).thenReturn(expectedCategory);

        // When:
        Category updatedCategory = categoryService.updateCategory(categoryId, category);

        // Then:
        assertSame(updatedCategory, expectedCategory);
        Mockito.verify(categoryRepository).update(categoryId, category);
        Mockito.verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    public void getAllCategoriesTest() {
        // Given:
        CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository);
        Iterable<Category> expectedCategories = List.of(new Category(), new Category());

        Mockito.when(categoryRepository.gettAll()).thenReturn(expectedCategories);

        // When:
        Iterable<Category> categories = categoryService.getAllCategories();

        // Then:
        assertSame(categories, expectedCategories);
        Mockito.verify(categoryRepository).gettAll();
        Mockito.verifyNoMoreInteractions(categoryRepository);
    }
}
