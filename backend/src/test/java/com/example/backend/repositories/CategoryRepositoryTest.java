package com.example.backend.repositories;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;
import java.util.Optional;
import java.util.UUID;
import com.example.backend.models.Category;

public class CategoryRepositoryTest {

    private CategoryRepository categoryRepository;

    @BeforeEach
    public void setUp() {
        categoryRepository = new CategoryRepository();
    }

    @Test
    public void saveCategoryTest() {
        // Given:
        Category category = new Category();
        category.setName("Electronics");

        // When:
        Category savedCategory = categoryRepository.save(category);

        // Then:
        assertNotNull(savedCategory.getId());  // ID should be generated
        assertEquals("Electronics", savedCategory.getName());
        assertTrue(categoryRepository.getById(savedCategory.getId()).isPresent());
    }

    @Test
    public void getCategoryByIdTest() {
        // Given:
        Category category = new Category();
        category.setName("Furniture");
        Category savedCategory = categoryRepository.save(category);

        // When:
        Optional<Category> retrievedCategory = categoryRepository.getById(savedCategory.getId());

        // Then:
        assertTrue(retrievedCategory.isPresent());
        assertEquals("Furniture", retrievedCategory.get().getName());
    }

    @Test
    public void getCategoryByIdNotFoundTest() {
        // Given:
        UUID nonExistentId = UUID.randomUUID();

        // When:
        Optional<Category> retrievedCategory = categoryRepository.getById(nonExistentId);

        // Then:
        assertFalse(retrievedCategory.isPresent());
    }

    @Test
    public void getAllCategoriesTest() {
        // Given:
        Category category1 = new Category();
        category1.setName("Electronics");
        categoryRepository.save(category1);

        Category category2 = new Category();
        category2.setName("Furniture");
        categoryRepository.save(category2);

        // When:
        Iterable<Category> categories = categoryRepository.gettAll();

        // Then:
        assertNotNull(categories);
        assertTrue(categories.iterator().hasNext());
    }

    @Test
    public void deleteCategoryTest() {
        // Given:
        Category category = new Category();
        category.setName("Clothing");
        Category savedCategory = categoryRepository.save(category);

        // When:
        boolean isDeleted = categoryRepository.delete(savedCategory.getId());

        // Then:
        assertTrue(isDeleted);
        assertFalse(categoryRepository.getById(savedCategory.getId()).isPresent());
    }

    @Test
    public void deleteCategoryNotFoundTest() {
        // Given:
        UUID nonExistentId = UUID.randomUUID();

        // When:
        boolean isDeleted = categoryRepository.delete(nonExistentId);

        // Then:
        assertFalse(isDeleted);
    }

    @Test
    public void updateCategoryTest() {
        // Given:
        Category category = new Category();
        category.setName("Toys");
        Category savedCategory = categoryRepository.save(category);

        // When:
        savedCategory.setName("Updated Toys");
        Category updatedCategory = categoryRepository.update(savedCategory.getId(), savedCategory);

        // Then:
        assertNotNull(updatedCategory);
        assertEquals("Updated Toys", updatedCategory.getName());
    }

    @Test
    public void updateCategoryNotFoundTest() {
        // Given:
        UUID nonExistentId = UUID.randomUUID();
        Category category = new Category();
        category.setName("Music");

        // When:
        Category updatedCategory = categoryRepository.update(nonExistentId, category);

        // Then:
        assertNull(updatedCategory);
    }
}
