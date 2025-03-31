import { render, screen, fireEvent } from "@testing-library/react";
import EditProductPage from "./page";
import * as productHook from "../../../app/hooks/useProducts";

// Mock hooks
jest.mock("../../../app/hooks/useProducts");
jest.mock("../../new/page", () =>
  jest.fn(() => <div data-testid="product-form" />)
);
jest.mock("../../../components/atoms/Spinner/Spinner", () =>
  jest.fn(() => <div role="status">Loading...</div>)
);
jest.mock("../../../components/molecules/ErrorMessage/ErrorMessage", () =>
  jest.fn(({ onClick, children }) => (
    <div>
      <span>{children}</span>
      <button onClick={onClick}>Retry</button>
    </div>
  ))
);

describe("EditProductPage Component", () => {
  const mockFetchData = jest.fn();
  const mockOnCancel = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the product form when there is no loading and no error", () => {
    jest.spyOn(productHook, "useProduct").mockReturnValue({
      loading: false,
      error: null,
      fetchData: mockFetchData,
      productId: "123",
      propsToSend: {
        productId: "123",
        refresh: mockRefresh,
        onCancel: mockOnCancel,
        typeOfSubmit: "update" as const,
      },
    });

    render(
      <EditProductPage
        productId="123"
        refresh={mockRefresh}
        onCancel={mockOnCancel}
        typeOfSubmit="edit"
      />
    );

    expect(screen.getByTestId("product-form")).toBeInTheDocument();
  });

  test("shows the loading spinner when loading is true", () => {
    jest.spyOn(productHook, "useProduct").mockReturnValue({
      loading: true,
      error: null,
      productId: undefined,
      fetchData: mockFetchData,
      propsToSend: {},
    });

    render(
      <EditProductPage
        productId="123"
        refresh={mockRefresh}
        onCancel={mockOnCancel}
        typeOfSubmit="edit"
      />
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("shows the error message when an error occurs", () => {
    jest.spyOn(productHook, "useProduct").mockReturnValue({
      loading: false,
      error: "Failed to load product",
      productId: undefined,
      fetchData: mockFetchData,
      propsToSend: {},
    });

    render(
      <EditProductPage
        productId="123"
        refresh={mockRefresh}
        onCancel={mockOnCancel}
        typeOfSubmit="edit"
      />
    );

    expect(screen.getByText(/failed to load product/i)).toBeInTheDocument();
  });

  test("calls fetchData when retry button is clicked after an error", () => {
    jest.spyOn(productHook, "useProduct").mockReturnValue({
      loading: false,
      productId: undefined,
      error: "Failed to load product",
      fetchData: mockFetchData,
      propsToSend: {},
    });

    render(
      <EditProductPage
        productId="123"
        refresh={mockRefresh}
        onCancel={mockOnCancel}
        typeOfSubmit="edit"
      />
    );

    fireEvent.click(screen.getByText(/retry/i));

    expect(mockFetchData).toHaveBeenCalled();
  });
});
