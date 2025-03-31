import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./HomePage";
import { useProducts } from "./hooks/useProducts";
import { useCategories } from "./hooks/useCategories";
import { usePagination } from "./hooks/usePagination";

// Personalized hooks mock
jest.mock("./hooks/useProducts");
jest.mock("./hooks/useCategories");
jest.mock("./hooks/usePagination");

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the filter form", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      totalPages: 1,
      loading: false,
      error: null,
      fetchProducts: jest.fn(),
    });

    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
      filterInputs: [],
      fetchCategories: jest.fn(),
      error: null,
    });

    (usePagination as jest.Mock).mockReturnValue({
      currentPage: 1,
      updateSearchParams: jest.fn(),
    });

    render(<Home />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  test("Shows the 'New Product' button when there are no errors and is not loading", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      totalPages: 1,
      loading: false,
      error: null,
      fetchProducts: jest.fn(),
    });

    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
      filterInputs: [],
      fetchCategories: jest.fn(),
      error: null,
    });

    render(<Home />);
    expect(
      screen.getByRole("button", { name: /new product/i })
    ).toBeInTheDocument();
  });

  test("Shows an error message when fails products fetching", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      totalPages: 1,
      loading: false,
      error: "Error loading products",
      fetchProducts: jest.fn(),
    });

    render(<Home />);
    expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
  });

  test("Shows an error message when fails categories fetching", () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
      filterInputs: [],
      fetchCategories: jest.fn(),
      error: "Error loading categories",
    });

    render(<Home />);
    expect(screen.getByText(/error loading categories/i)).toBeInTheDocument();
  });

  test("Shows the Spinner when is loading", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      totalPages: 1,
      loading: true,
      error: null,
      fetchProducts: jest.fn(),
    });

    render(<Home />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("Shows 'No products found' when there are no products", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      totalPages: 1,
      loading: false,
      error: null,
      fetchProducts: jest.fn(),
    });

    render(<Home />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  test("Shows the products table and pagination when there are products", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [{ id: "1", name: "Product 1", categoryId: "cat1" }],
      totalPages: 2,
      loading: false,
      error: null,
      fetchProducts: jest.fn(),
    });

    (useCategories as jest.Mock).mockReturnValue({
      categories: [{ id: "cat1", name: "Category 1" }],
      filterInputs: [],
      fetchCategories: jest.fn(),
      error: null,
    });

    render(<Home />);
    expect(screen.getByTestId("products-table")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText(/>>/)).toBeInTheDocument(); //Verifies that pagination is present
  });
});
