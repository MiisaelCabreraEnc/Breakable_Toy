import { useState, useEffect, useCallback } from "react";
import { getCategories } from "../../services/categories";
import Category from "../../interfaces/CategoryInterface";
import { InputProps } from "../../components/atoms/Input/Input";
import { PRODUCT_FORM_INPUTS } from "../../constants";
import ProductInterface from "../../interfaces/ProuctInterface";

export function useFetchFormData(productData?: ProductInterface) {
  const [inputs, setInputs] = useState<InputProps[]>(PRODUCT_FORM_INPUTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and update form fields
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const categoriesData = await getCategories();
      if (categoriesData.error) throw new Error(categoriesData.error);

      const options = [
        { children: "Create a new category", value: "" },
        ...categoriesData.map((category: Category) => ({
          children: category.name,
          value: category.id.toString(),
        })),
      ];

      // Map input fields and set default values
      const updatedInputs: InputProps[] = PRODUCT_FORM_INPUTS.map((input) => {
        if (input.name === "categoryId") {
          return {
            as: "select" as const,
            label: "Category",
            name: "categoryId",
            options,
            formValue: productData?.categoryId ?? "",
          };
        }
        return {
          ...input,
          formValue: productData?.[input.name as keyof ProductInterface] ?? "",
        };
      });

      setInputs(updatedInputs);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setError("Failed to load form data.");
    } finally {
      setLoading(false);
    }
  }, [productData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { inputs, loading, error, fetchData };
}
