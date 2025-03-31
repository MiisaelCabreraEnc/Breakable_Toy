import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "../../services/categories";
import { createProduct, updateProduct } from "../../services/products";

export function useProductForm(
  typeOfSubmit: "create" | "update",
  fetchData: () => void,
  productId?: string,
  refresh?: () => void,
  onCancel?: () => void
) {
  const router = useRouter();
  const handleCancel = onCancel ?? (() => router.back());
  const [error, setError] = useState<string | null>(null);

  const hasEmptyValue = (
    formData: Record<string, string | number>
  ): boolean => {
    if (formData.name === "") {
      setError("Product name is required.");
      return true;
    }
    if (formData.price.toString() === "") {
      setError("Product price is required.");
      return true;
    }
    if (formData.stock.toString() === "") {
      setError("Product stock is required.");
      return true;
    }
    return false;
  };

  // Handle product creation or update
  const handleSubmit = useCallback(
    async (formData: Record<string, string | number>) => {
      setError(null);

      try {
        if (hasEmptyValue(formData)) return;
        if (formData.categoryId === "") {
          const newCategory = await createCategory(
            formData.newCategory.toString()
          );
          if (newCategory.error) throw new Error(newCategory.error);
          formData.categoryId = newCategory.id;
        }

        let result;
        if (typeOfSubmit === "update" && productId) {
          result = await updateProduct(productId, formData);
        } else {
          result = await createProduct(formData);
        }

        if (result.error) throw new Error(result.error);

        if (refresh) {
          refresh();
          handleCancel();
        } else {
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setError("Failed to submit form.");
      }
    },
    [refresh, handleCancel, fetchData, router, productId, typeOfSubmit]
  );

  return { handleSubmit, handleCancel, error };
}
