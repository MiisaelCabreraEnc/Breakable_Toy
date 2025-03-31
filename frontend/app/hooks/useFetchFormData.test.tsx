import { renderHook, act } from "@testing-library/react";
import { useFetchFormData } from "../hooks/useFetchFormData";
import { getCategories } from "../../services/categories";
import { PRODUCT_FORM_INPUTS } from "../../constants";
import ProductInterface from "../../interfaces/ProuctInterface";

// Mock of `getCategories`
jest.mock("../../services/categories", () => ({
  getCategories: jest.fn(),
}));

describe("useFetchFormData Hook", () => {
  const mockProductData: ProductInterface = {
    id: "1",
    name: "Test Product",
    expirationDate: "2023-12-31",
    creationDate: "2023-01-01",
    updateDate: "2023-01-02",
    stock: 10,
    price: 100,
    categoryId: "2",
  };

  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("Must load categories and update options correctly", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ]);

    const { result } = renderHook(() => useFetchFormData(mockProductData));

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.inputs).toEqual(
      PRODUCT_FORM_INPUTS.map((input) =>
        input.name === "categoryId"
          ? {
              as: "select",
              label: "Category",
              name: "categoryId",
              options: [
                { children: "Create a new category", value: "" },
                { children: "Category 1", value: "1" },
                { children: "Category 2", value: "2" },
              ],
              formValue: "2",
            }
          : {
              ...input,
              formValue:
                mockProductData[input.name as keyof ProductInterface] ?? "",
            }
      )
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("must handle error while fetching categories", async () => {
    (getCategories as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useFetchFormData());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.inputs).toEqual(PRODUCT_FORM_INPUTS);
    expect(result.current.error).toBe("Failed to load form data.");
    expect(result.current.loading).toBe(false);
  });

  test("Must start `loading` with `true` and then become `false`", async () => {
    (getCategories as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useFetchFormData());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.loading).toBe(false);
  });
});
