import { renderHook, act } from "@testing-library/react";
import { useProductForm } from "../hooks/useProductForm";
import { useRouter } from "next/navigation";
import { createCategory } from "../../services/categories";
import { createProduct, updateProduct } from "../../services/products";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock API services
jest.mock("../../services/categories", () => ({
  createCategory: jest.fn(),
}));

jest.mock("../../services/products", () => ({
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
}));

describe("useProductForm Hook", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockBack = jest.fn();
  const mockFetchData = jest.fn();

  const originalConsoleError = console.error;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      back: mockBack,
    });
    console.error = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("Should call router.back() when handleCancel is invoked", () => {
    const { result } = renderHook(() =>
      useProductForm("create", mockFetchData)
    );

    act(() => {
      result.current.handleCancel();
    });

    expect(mockBack).toHaveBeenCalled();
  });

  test("Should show an error if required fields are empty", async () => {
    const { result } = renderHook(() =>
      useProductForm("create", mockFetchData)
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "", price: "", stock: "" });
    });

    expect(result.current.error).toBe("Product name is required.");
  });

  test("Should create a new category if categoryId is empty", async () => {
    (createCategory as jest.Mock).mockResolvedValue({ id: "newCategoryId" });
    (createProduct as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() =>
      useProductForm("create", mockFetchData)
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "New Product",
        price: 100,
        stock: 10,
        categoryId: "",
        newCategory: "New Category",
      });
    });

    expect(createCategory).toHaveBeenCalledWith("New Category");
    expect(createProduct).toHaveBeenCalledWith({
      name: "New Product",
      price: 100,
      stock: 10,
      categoryId: "newCategoryId",
      newCategory: "New Category",
    });
  });

  test("Should call updateProduct when typeOfSubmit is 'update'", async () => {
    (updateProduct as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() =>
      useProductForm("update", mockFetchData, "123")
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "Updated Product",
        price: 200,
        stock: 5,
        categoryId: "existingCategory",
      });
    });

    expect(updateProduct).toHaveBeenCalledWith("123", {
      name: "Updated Product",
      price: 200,
      stock: 5,
      categoryId: "existingCategory",
    });
  });

  test("Should call router.push and refresh after successful submission", async () => {
    (createProduct as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() =>
      useProductForm("create", mockFetchData)
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "Product",
        price: 150,
        stock: 20,
        categoryId: "someCategory",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockRefresh).toHaveBeenCalled();
  });

  test("Should set error if API request fails", async () => {
    (createProduct as jest.Mock).mockResolvedValue({ error: "API Error" });

    const { result } = renderHook(() =>
      useProductForm("create", mockFetchData)
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "Product",
        price: 150,
        stock: 20,
        categoryId: "someCategory",
      });
    });

    expect(result.current.error).toBe("Failed to submit form.");
  });
});
