import { render, screen, fireEvent } from "@testing-library/react";
import ProductsTable from "./ProductsTable";
import { ORDER_BY_TYPES } from "../../../constants";
import Product from "../../../interfaces/ProuctInterface";
import Category from "../../../interfaces/CategoryInterface";

// Mocking the ProductsTableItem component to avoid rendering its implementation
jest.mock("../../molecules/ProductsTableItem/ProductsTableItem", () => ({
  __esModule: true,
  default: ({ name, categoryName }: { name: string; categoryName: string }) => (
    <tr>
      <td>{name}</td>
      <td>{categoryName}</td>
    </tr>
  ),
}));

describe("ProductsTable Component", () => {
  const mockOnOrder = jest.fn();
  const mockRefresh = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const categories: Category[] = [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Clothing" },
  ];

  const products: Product[] = [
    {
      id: "101",
      name: "Laptop",
      categoryId: "1",
      price: 1000,
      expirationDate: "2023-12-31",
      stock: 10,
      creationDate: "2023-01-01",
      updateDate: "2023-01-02",
    },
    {
      id: "102",
      name: "T-Shirt",
      categoryId: "2",
      price: 20,
      expirationDate: "2024-12-31",
      stock: 50,
      creationDate: "2023-01-01",
      updateDate: "2023-01-02",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the table with correct headers", () => {
    render(
      <ProductsTable
        categories={categories}
        products={products}
        onOrder={mockOnOrder}
        refresh={mockRefresh}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    ORDER_BY_TYPES.forEach((type) => {
      expect(screen.getByText(type.name)).toBeInTheDocument();
    });

    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("calls onOrder when clicking sorting icons", () => {
    render(
      <ProductsTable
        categories={categories}
        products={products}
        onOrder={mockOnOrder}
        refresh={mockRefresh}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const orderIcons = screen.getAllByTestId("order-icon"); //Search for sorting buttons

    orderIcons.forEach((icon, index) => {
      fireEvent.click(icon);
      expect(mockOnOrder).toHaveBeenCalledWith({
        orderedBy: ORDER_BY_TYPES[index].orderedBy,
      });
    });

    expect(mockOnOrder).toHaveBeenCalledTimes(ORDER_BY_TYPES.length);
  });

  it("renders the correct product rows", () => {
    render(
      <ProductsTable
        categories={categories}
        products={products}
        onOrder={mockOnOrder}
        refresh={mockRefresh}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
  });
});
