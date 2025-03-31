import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../hooks/usePagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Mock Next.js navigation functions
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("usePagination Hook", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("page=2")
    );
    (useRouter as jest.Mock).mockReturnValue({ replace: jest.fn() });
    (usePathname as jest.Mock).mockReturnValue("/products");
    console.error = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("Should return the correct current page from URL", () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.currentPage).toBe(2);
  });

  test("Should default to page 1 when no 'page' parameter is present", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));

    const { result } = renderHook(() => usePagination());
    expect(result.current.currentPage).toBe(1);
  });

  test("Should update search params correctly", () => {
    const mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.updateSearchParams({ category: "electronics", page: 3 });
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/products?page=3&category=electronics"
    );
  });

  test("Should remove empty search parameters", () => {
    const mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.updateSearchParams({
        category: "electronics",
        page: undefined,
      });
    });

    expect(mockReplace).toHaveBeenCalledWith("/products?category=electronics");
  });
});
