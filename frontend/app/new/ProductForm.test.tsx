import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "./page";
import * as fetchHook from "../hooks/useFetchFormData";
import * as formHook from "../hooks/useProductForm";
import { PRODUCT_FORM_INPUTS } from "../../constants";

// Mock hooks
jest.mock("../hooks/useFetchFormData");
jest.mock("../hooks/useProductForm");

describe("ProductForm Component", () => {
  const mockOnCancel = jest.fn();
  const mockRefresh = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockFetchData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(fetchHook, "useFetchFormData").mockImplementation(() => ({
      inputs: PRODUCT_FORM_INPUTS,
      loading: false,
      error: null,
      fetchData: mockFetchData,
    }));

    jest.spyOn(formHook, "useProductForm").mockImplementation(() => ({
      handleCancel: mockOnCancel,
      handleSubmit: mockHandleSubmit,
      error: null,
    }));
  });

  test("renders form inputs and buttons when there is no error", () => {
    render(<ProductForm onCancel={mockOnCancel} refresh={mockRefresh} />);

    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("calls handleSubmit on form submission", async () => {
    render(<ProductForm onCancel={mockOnCancel} refresh={mockRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  test("displays error message when form submission fails", () => {
    jest.spyOn(formHook, "useProductForm").mockImplementation(() => ({
      handleCancel: mockOnCancel,
      handleSubmit: mockHandleSubmit,
      error: "Submission failed",
    }));

    render(<ProductForm onCancel={mockOnCancel} refresh={mockRefresh} />);

    expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
  });

  test("calls handleCancel when clicking 'Cancel' button", () => {
    render(<ProductForm onCancel={mockOnCancel} refresh={mockRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("shows loading spinner when data is being fetched", () => {
    jest.spyOn(fetchHook, "useFetchFormData").mockImplementation(() => ({
      inputs: [],
      loading: true,
      error: null,
      fetchData: mockFetchData,
    }));

    render(<ProductForm onCancel={mockOnCancel} refresh={mockRefresh} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("displays error message when data fetching fails", () => {
    jest.spyOn(fetchHook, "useFetchFormData").mockImplementation(() => ({
      inputs: [],
      loading: false,
      error: "Failed to fetch form data",
      fetchData: mockFetchData,
    }));

    render(<ProductForm onCancel={mockOnCancel} refresh={mockRefresh} />);

    expect(screen.getByText(/failed to fetch form data/i)).toBeInTheDocument();
  });
});
