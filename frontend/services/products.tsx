// This module handles API requests related to products.

const API_URL = process.env.NEXT_PUBLIC_API_URI;

/**
 * Fetches a list of products based on search parameters.
 * @param {string} searchParams - Query parameters for filtering products.
 * @returns {Promise<any>} - The fetched product list or an error object.
 */
export async function getProducts(searchParams: string) {
  try {
    const response = await fetch(`${API_URL}/products${searchParams}`);

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { error: "Unable to fetch products." };
  }
}

/**
 * Fetches the total count of products.
 * @returns {Promise<number>} - Total number of products or an error object.
 */
export async function getTotalProducts() {
  try {
    const response = await fetch(`${API_URL}/products/total`);

    if (!response.ok) {
      throw new Error(`Error fetching total products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch total products:", error);
    return { error: "Unable to fetch total product count." };
  }
}

/**
 * Deletes a product by its ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<any>} - The response from the API.
 */
export async function deleteProduct(id: string) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error);
    return { error: "Unable to delete product." };
  }
}

/**
 * Creates a new product.
 * @param {any} formData - The product data to be sent in the request.
 * @returns {Promise<any>} - The created product data or an error object.
 */
export async function createProduct(formData: any) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error creating product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create product:", error);
    return { error: "Unable to create product." };
  }
}

/**
 * Fetches a single product by ID.
 * @param {string | string[]} id - The ID of the product to fetch.
 * @returns {Promise<any>} - The fetched product data or an error object.
 */
export async function getProductById(id: string | string[]) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return { error: "Unable to fetch product details." };
  }
}

/**
 * Updates an existing product by ID.
 * @param {string | string[]} id - The ID of the product to update.
 * @param {any} formData - The updated product data.
 * @returns {Promise<any>} - The updated product data or an error object.
 */
export async function updateProduct(id: string | string[], formData: any) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error updating product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error);
    return { error: "Unable to update product." };
  }
}

/**
 * Updates the stock of a product by ID.
 * @param {number} stock - The updated stock value.
 * @param {string} id - The ID of the product to update.
 * @returns {Promise<any>} - The updated product data or an error object.
 */
export async function updateStock(stock: number, id: string) {
  try {
    const request = stock === 0 ? "instock" : "outofstock";
    const response = await fetch(`${API_URL}/products/${id}/${request}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error updating product: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error);
    return { error: "Unable to update product." };
  }
}
