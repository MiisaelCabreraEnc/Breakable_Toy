"use client";

import { FunctionComponent, useState } from "react";
import Product from "../../../interfaces/ProuctInterface";
import EditIcon from "../../atoms/Icons/EditIcon/EditIcon";
import DeleteIcon from "../../atoms/Icons/DeleteIcon/DeleteIcon";
import { updateStock } from "../../../services/products";

/**
 * Props for a single row in the products table.
 */
export interface ProductsTableItemProps extends Product {
  categoryName: string; // Name of the category
  onDelete: (id: string) => void; // Function to delete the product
  onEdit: (id: string) => void; // Function to edit the product
  refresh: () => void; // Function to refresh product data
}

/**
 * Base styles for table cells.
 */
const TD_STYLE =
  "border text-center py-4 transition-all duration-300 ease-in-out";

/**
 * Background colors based on stock level and expiration status.
 */
const TD_BACKGROUND = {
  red: "bg-red-700",
  orange: "bg-orange-700",
  yellow: "bg-yellow-700",
  green: "bg-green-700",
};

/**
 * A table row component that displays product details.
 * - Highlights expiration status with color.
 * - Toggles stock availability using a checkbox.
 * - Provides edit and delete actions.
 */
const ProductsTableItem: FunctionComponent<ProductsTableItemProps> = ({
  id,
  categoryName,
  name,
  price,
  expirationDate,
  stock,
  onDelete,
  refresh,
  onEdit,
}) => {
  const [currentStock, setCurrentStock] = useState(stock);
  let rowBackground = "";

  /**
   * Determines row background color based on expiration date:
   * - **Red:** Expires in less than a week.
   * - **Yellow:** Expires in 1-2 weeks.
   * - **Green:** Safe for more than 2 weeks.
   */
  if (expirationDate) {
    const currentDate = new Date();
    const expiresIn = new Date(expirationDate);
    const timeBeforeExpires = expiresIn.getTime() - currentDate.getTime();
    const weekMiliseconds = 1000 * 60 * 60 * 24 * 7;

    rowBackground =
      timeBeforeExpires < weekMiliseconds
        ? TD_BACKGROUND.red
        : timeBeforeExpires > weekMiliseconds * 2
        ? TD_BACKGROUND.green
        : TD_BACKGROUND.yellow;

    expirationDate = new Intl.DateTimeFormat("en-EN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
      .format(expiresIn)
      .replace(".", "");
  }

  /**
   * Determines stock background color:
   * - **Red:** Stock < 5.
   * - **Orange:** Stock between 5 and 10.
   * - **No color:** Stock > 10.
   */
  const stockBackground =
    currentStock < 5
      ? TD_BACKGROUND.red
      : currentStock <= 10
      ? TD_BACKGROUND.orange
      : "";

  /**
   * Handles stock availability toggle.
   */
  const handleStockToggle = async () => {
    try {
      const updatedProduct = await updateStock(currentStock, id);
      setCurrentStock(updatedProduct.stock);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  /**
   * Handles product deletion and refreshes the table.
   */
  const handleDelete = async () => {
    try {
      await onDelete(id);
      refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <tr className={rowBackground}>
      {/* Stock toggle checkbox */}
      <td className={TD_STYLE}>
        <input
          type="checkbox"
          data-testid="stock-toggle"
          onChange={handleStockToggle}
          checked={currentStock === 0}
        />
      </td>

      {/* Product details */}
      <td className={TD_STYLE}>{categoryName}</td>
      <td className={TD_STYLE}>{name}</td>
      <td className={TD_STYLE}>
        {"$ "}
        {price}
      </td>
      <td className={TD_STYLE}>{expirationDate}</td>
      <td className={`${TD_STYLE} ${stockBackground}`}>{currentStock}</td>

      {/* Edit & Delete actions */}
      <td className={TD_STYLE}>
        <span className="flex mx-auto w-full justify-evenly font-bold">
          <EditIcon
            data-testid="edit-icon"
            onClick={() => onEdit(id)}
            className="h-6 w-6 text-white cursor-pointer"
          />
          /
          <DeleteIcon
            data-testid="delete-icon"
            onClick={handleDelete}
            className="h-6 w-6 text-white cursor-pointer"
          />
        </span>
      </td>
    </tr>
  );
};

export default ProductsTableItem;
