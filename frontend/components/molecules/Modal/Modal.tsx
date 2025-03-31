import { FunctionComponent, useEffect, useState } from "react";
import ProductForm from "../../../app/new/page";
import EditProduct from "../../../app/edit/[id]/page";

/**
 * Props for the Modal component.
 */
interface ModalProps {
  isOpen: boolean; // Determines if the modal is open
  onClose: () => void; // Function to close the modal
  refresh?: () => void; // Function to refresh data after submission
  type: "create" | "update"; // Determines which form to show
  productId?: string; // The product ID (only for editing)
}

/**
 * A modal component that displays a form for creating or editing products.
 *
 * - Uses `useState` to manage visibility with a fade-in/out animation.
 * - Closes when clicking outside the modal.
 * - Prevents accidental closing when clicking inside the modal.
 */
const Modal: FunctionComponent<ModalProps> = ({
  isOpen,
  onClose,
  refresh,
  type,
  productId,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Controls the modal animation:
   * - When `isOpen` is `true`, `isVisible` is set to `true` instantly.
   * - When `isOpen` is `false`, it waits **300ms** before unmounting to allow the animation to complete.
   */
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [isOpen]);

  // Avoid rendering when the modal is fully hidden
  if (!isOpen && !isVisible) return null;

  return (
    <div
      data-testid="modal-overlay"
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        data-testid="modal-content"
        className={`bg-black border  w-1/2  shadow-lg rounded-lg transition-all ease-in-out duration-500 ${
          isVisible
            ? " opacity-100 scale-100"
            : " " + !isOpen
            ? " opacity-0 scale-90"
            : ""
        }`}
        onClick={(e) => e.stopPropagation()} // Avoid closing the modal when clicking inside
      >
        {/* Render the appropriate form based on `type` */}
        {type === "create" ? (
          <ProductForm
            onCancel={onClose}
            typeOfSubmit={type}
            refresh={refresh}
          />
        ) : (
          <EditProduct
            productId={productId}
            onCancel={onClose}
            typeOfSubmit={type}
            refresh={refresh}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
