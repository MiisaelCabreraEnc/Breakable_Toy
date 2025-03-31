import { useState, useEffect } from "react";
import { getCategories } from "../../services/categories";
import { InputProps } from "../../components/atoms/Input/Input";
import Category from "../../interfaces/CategoryInterface";

export function useCategories(initialFilterInputs: InputProps[]) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterInputs, setFilterInputs] =
    useState<InputProps[]>(initialFilterInputs);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories and update filter options
  async function fetchCategories() {
    setLoading(true);
    setError(null);

    try {
      const categoriesData = await getCategories();
      if (categoriesData.error) throw new Error(categoriesData.error);

      setCategories(categoriesData);

      // Dynamically update filter inputs with category options
      setFilterInputs((prevInputs) => {
        const updatedInputs = [...prevInputs];
        if (updatedInputs[1].as === "select") {
          updatedInputs[1].options = [
            { children: "All", value: "0" },
            ...categoriesData.map((category: Category) => ({
              children: category.name,
              value: category.id,
            })),
          ];
        }
        return updatedInputs;
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, filterInputs, fetchCategories, loading, error };
}
