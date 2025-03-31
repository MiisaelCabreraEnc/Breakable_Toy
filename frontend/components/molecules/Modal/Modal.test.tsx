import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

jest.mock("../../../app/new/page", () =>
  jest.fn(() => <div>Product Form</div>)
);
jest.mock("../../../app/edit/[id]/page", () =>
  jest.fn(() => <div>Edit Product</div>)
);

describe("Modal Component", () => {
  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Does not render when `isOpen` is `false`
   */
  it("does not render when closed", () => {
    render(<Modal isOpen={false} onClose={mockOnClose} type="create" />);

    expect(screen.queryByText("Product Form")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit Product")).not.toBeInTheDocument();
  });

  /**
   * Test: Renders when `isOpen` is `true`
   */
  it("renders when open", () => {
    render(<Modal isOpen={true} onClose={mockOnClose} type="create" />);

    expect(screen.getByText("Product Form")).toBeInTheDocument();
  });

  /**
   * Test: Displays `ProductForm` when `type` is "create"
   */
  it("renders ProductForm when type is 'create'", () => {
    render(<Modal isOpen={true} onClose={mockOnClose} type="create" />);

    expect(screen.getByText("Product Form")).toBeInTheDocument();
  });

  /**
   * Test: Displays `EditProduct` when `type` is "update"
   */
  it("renders EditProduct when type is 'update'", () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        type="update"
        productId="123"
      />
    );

    expect(screen.getByText("Edit Product")).toBeInTheDocument();
  });

  /**
   * Test: Calls `onClose` when clicking outside the modal
   */
  it("calls onClose when clicking outside the modal", () => {
    render(<Modal isOpen={true} onClose={mockOnClose} type="create" />);

    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Test: Does not close when clicking inside the modal
   */
  it("does not close when clicking inside the modal", () => {
    render(<Modal isOpen={true} onClose={mockOnClose} type="create" />);

    const modalContent = screen.getByTestId("modal-content");
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
