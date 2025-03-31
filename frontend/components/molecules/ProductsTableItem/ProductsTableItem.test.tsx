import { render, screen, fireEvent } from "@testing-library/react";
import ProductsTableItem, { ProductsTableItemProps } from "./ProductsTableItem";
import { updateStock } from "../../../services/products";

jest.mock("../../../services/products", () => ({
  updateStock: jest.fn(),
}));

describe("ProductsTableItem Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockRefresh = jest.fn();

  const productProps: ProductsTableItemProps = {
    id: "1",
    categoryName: "Electronics",
    name: "Laptop",
    categoryId: "2",
    creationDate: "2023-01-01",
    updateDate: "2023-01-02",
    price: 1200,
    expirationDate: "2025-12-31",
    stock: 10,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    refresh: mockRefresh,
  };

  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  /**
   * Test: Renders product details correctly.
   */
  it("renders the product details correctly", () => {
    render(
      <table>
        <tbody>
          <ProductsTableItem {...productProps} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("$ 1200")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  /**
   * Test: Displays formatted expiration date.
   */
  it("formats and displays the expiration date correctly", () => {
    render(
      <table>
        <tbody>
          <ProductsTableItem {...productProps} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Dec 31, 2025")).toBeInTheDocument();
  });

  /**
   * Test: Calls `onEdit` when clicking the edit icon.
   */
  it("calls onEdit when clicking the edit icon", () => {
    render(
      <table>
        <tbody>
          <ProductsTableItem {...productProps} />
        </tbody>
      </table>
    );

    // Find the edit icon and click it
    const editIcon = screen.getByTestId("edit-icon");
    fireEvent.click(editIcon);

    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  /**
   * Test: Calls `onDelete` when clicking the delete icon.
   */
  it("calls onDelete when clicking the delete icon", async () => {
    render(
      <table>
        <tbody>
          <ProductsTableItem {...productProps} />
        </tbody>
      </table>
    );

    // Find the delete icon and click it
    const deleteIcon = screen.getByTestId("delete-icon");
    await fireEvent.click(deleteIcon);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
    expect(mockRefresh).toHaveBeenCalled();
  });

  /**
   * Test: Toggles stock availability when checkbox is clicked.
   */
  it("toggles stock availability when checkbox is clicked", async () => {
    (updateStock as jest.Mock).mockResolvedValue({ stock: 0 });

    render(
      <table>
        <tbody>
          <ProductsTableItem {...productProps} />
        </tbody>
      </table>
    );

    const checkbox = screen.getByTestId("stock-toggle");
    fireEvent.click(checkbox);

    expect(updateStock).toHaveBeenCalledWith(10, "1");
    expect(await screen.findByRole("checkbox")).not.toBeChecked();
  });

  /**
   * Test: Handles error when stock update fails.
   */
  it("handles error when stock update fails", async () => {
    (updateStock as jest.Mock).mockRejectedValue(
      new Error("Stock update failed")
    );

    render(
      <table>
        <tbody>
          <ProductsTableItem {...productProps} />
        </tbody>
      </table>
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(updateStock).toHaveBeenCalledWith(10, "1");
    expect(await screen.findByRole("checkbox")).not.toBeChecked();
  });

  /**
   * Test: Handles error when deletion fails.
   */
  it("handles error when deletion fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress error logs
    mockOnDelete.mockRejectedValue(new Error("Delete failed"));

    render(
      <table>
        <tbody>
          <ProductsTableItem {...productProps} />
        </tbody>
      </table>
    );

    const deleteIcon = screen.getByTestId("delete-icon");
    fireEvent.click(deleteIcon);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
