package com.example.backend.controllers;

import com.example.backend.models.Category;
import com.example.backend.services.ICategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class CategoryControllerTest {

    @Test
    public void createCategoryTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        Category category = new Category();
        category.setName("Electronics");

        Category expectedCategory = new Category();
        expectedCategory.setName("Electronics");

        Mockito.when(categoryService.saveCategory(Mockito.any(Category.class))).thenReturn(expectedCategory);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        String jsonCategory = objectMapper.writeValueAsString(category);

        // When and then
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonCategory))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Electronics"));
    }

    @Test
    void deleteCategorySuccessTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        UUID categoryId = UUID.randomUUID();

        Mockito.when(categoryService.deleteCategory(categoryId)).thenReturn(true);

        mockMvc.perform(delete("/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void deleteCategoryNotFoundTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        UUID categoryId = UUID.randomUUID();

        Mockito.when(categoryService.deleteCategory(categoryId)).thenReturn(false);

        // When and then
        mockMvc.perform(delete("/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string("false"));
    }

    @Test
    public void getCategoryByIdTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        UUID categoryId = UUID.randomUUID();
        Category category = new Category();
        category.setName("Electronics");

        Mockito.when(categoryService.getCategoryById(categoryId)).thenReturn(java.util.Optional.of(category));

        // When and then
        mockMvc.perform(get("/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Electronics"));
    }

    @Test
    void getCategoryByIdNotFoundTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        UUID categoryId = UUID.randomUUID();

        Mockito.when(categoryService.getCategoryById(categoryId)).thenReturn(java.util.Optional.empty());

        // When and then
        mockMvc.perform(get("/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void getAllCategoriesTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        Category category1 = new Category();
        category1.setName("Electronics");

        Category category2 = new Category();
        category2.setName("Furniture");

        List<Category> categories = Arrays.asList(category1, category2);

        Mockito.when(categoryService.getAllCategories()).thenReturn(categories);

        // When and Then
        mockMvc.perform(get("/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Electronics"))
                .andExpect(jsonPath("$[1].name").value("Furniture"));
    }

    @Test
    public void updateCategoryTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        UUID categoryId = UUID.randomUUID();
        Category category = new Category();
        category.setName("Updated Electronics");

        Category updatedCategory = new Category();
        updatedCategory.setName("Updated Electronics");

        Mockito.when(categoryService.updateCategory(Mockito.any(UUID.class), Mockito.any(Category.class)))
                .thenReturn(updatedCategory);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        String jsonCategory = objectMapper.writeValueAsString(category);

        // When and then
        mockMvc.perform(put("/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonCategory))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Electronics"));
    }

    @Test
    void updateCategoryNotFoundTest() throws Exception {
        // Given
        ICategoryService categoryService = Mockito.mock(ICategoryService.class);
        CategoryController categoryController = new CategoryController(categoryService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

        UUID categoryId = UUID.randomUUID();
        Category category = new Category();
        category.setName("Non Existent Category");

        Mockito.when(categoryService.updateCategory(Mockito.any(UUID.class), Mockito.any(Category.class)))
                .thenReturn(null);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        String jsonCategory = objectMapper.writeValueAsString(category);

        // When and then
        mockMvc.perform(put("/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonCategory))
                .andExpect(status().isNotFound());
    }
}
