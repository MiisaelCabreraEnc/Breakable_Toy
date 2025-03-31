// This module handles API requests related to categories.

const API_URL = process.env.NEXT_PUBLIC_API_URI;

/**
 * Fetches a list of categories.
 * @returns {Promise<any>} - The fetched category list or an error object.
 */
export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { error: "Unable to fetch categories." };
  }
}

/**
 * Creates a new category.
 * @param {string} categoryName - The name of the new category.
 * @returns {Promise<any>} - The created category data or an error object.
 */
export async function createCategory(categoryName: string) {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!response.ok) {
      throw new Error(`Error creating category: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create category:", error);
    return { error: "Unable to create category." };
  }
}
