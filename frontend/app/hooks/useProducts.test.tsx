import { renderHook, act } from "@testing-library/react";
import { useProducts, useProduct } from "../hooks/useProducts";
import { useSearchParams, useParams } from "next/navigation";
import {
  getProducts,
  getTotalProducts,
  getProductById,
} from "../../services/products";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useParams: jest.fn(),
}));

// Mock API services
jest.mock("../../services/products", () => ({
  getProducts: jest.fn(),
  getTotalProducts: jest.fn(),
  getProductById: jest.fn(),
}));

describe("useProducts Hook", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("Should fetch products and total pages correctly", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (getProducts as jest.Mock).mockResolvedValue([
      { id: 1, name: "Product A" },
    ]);
    (getTotalProducts as jest.Mock).mockResolvedValue(15);

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await result.current.fetchProducts();
    });

    expect(getProducts).toHaveBeenCalled();
    expect(getTotalProducts).toHaveBeenCalled();
    expect(result.current.products).toEqual([{ id: 1, name: "Product A" }]);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("Should set error when API call fails", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (getProducts as jest.Mock).mockResolvedValue({ error: "API Error" });
    (getTotalProducts as jest.Mock).mockResolvedValue(10);

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await result.current.fetchProducts();
    });

    expect(result.current.error).toBe("Failed to load products.");
    expect(result.current.loading).toBe(false);
  });
});

describe("useProduct Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should fetch product by ID correctly", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (getProductById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Product A",
    });

    const { result } = renderHook(() => useProduct("1"));

    await act(async () => {
      await result.current.fetchData();
    });

    expect(getProductById).toHaveBeenCalledWith("1");
    expect(result.current.propsToSend).toEqual({
      productData: { id: 1, name: "Product A" },
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("Should return error if product fetch fails", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (getProductById as jest.Mock).mockResolvedValue({ error: "API Error" });

    const { result } = renderHook(() => useProduct("1"));

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.error).toBe("Failed to load product.");
    expect(result.current.loading).toBe(false);
  });

  test("Should not fetch product if ID is missing", async () => {
    (useParams as jest.Mock).mockReturnValue({});
    (getProductById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Product A",
    });

    const { result } = renderHook(() => useProduct());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(getProductById).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
