import { FunctionComponent } from "react";
import ProductsTableItem from "../../molecules/ProductsTableItem/ProductsTableItem";
import Product from "../../../interfaces/ProuctInterface";
import Category from "../../../interfaces/CategoryInterface";
import OrderIcon from "../../atoms/Icons/OrderIcon/OrderIcon";
import { ORDER_BY_TYPES } from "../../../constants";
import FilterData from "../../../interfaces/FilterInterface";

/**
 * Define sorting options for each column.
 * Each object contains:
 * - `label`: the text shown in the column header
 * - `orderedBy`: the property used to sort the products
 */

/**
 * Props for the ProductsTable component:
 * - `categories`: List of product categories for displaying category names.
 * - `products`: List of products to be displayed in the table.
 * - `onOrder`: Function to handle sorting by column.
 * - `refresh`: Function to refresh the product list after an action.
 * - `onDelete`: Function to delete a product.
 * - `onEdit`: Function to edit a product.
 */
interface ProductsTableProps {
  categories: Category[];
  products: Product[];
  onOrder: (filterData: FilterData) => void;
  refresh: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

/**
 * ProductsTable component:
 * - Renders a table displaying products.
 * - The table headers are dynamically generated from `ORDER_BY_TYPES`.
 * - Each header is clickable and triggers sorting by the corresponding property.
 */
const ProductsTable: FunctionComponent<ProductsTableProps> = ({
  products,
  categories,
  onOrder,
  refresh,
  onDelete,
  onEdit,
}) => {
  return (
    <table className="border my-4" data-testid="products-table">
      <thead>
        <tr>
          {/* Empty cell for checkboxes or any future additional columns */}
          <th className="border py-4"></th>

          {/* Dynamically generate table headings with sorting functionality */}
          {ORDER_BY_TYPES.map((type) => (
            <th className="py-4 border" key={type.orderedBy}>
              <span className="inline-flex items-center">
                {type.name} {/* Display column name */}
                <OrderIcon
                  onClick={() => onOrder({ orderedBy: type.orderedBy })} // Call `onOrder` to sort products by this column
                  className="text-white h-4 w-4 ml-1 cursor-pointer" // Sort icon
                  data-testid="order-icon"
                />
              </span>
            </th>
          ))}

          {/* Action buttons column (edit/delete) */}
          <th className="border py-4">Actions</th>
        </tr>
      </thead>

      <tbody>
        {/* Render each product row */}
        {products.map((product, index) => {
          // Find the corresponding category for the product
          const category = categories.find((category) => {
            return category.id === product.categoryId;
          });

          return (
            <ProductsTableItem
              key={"product_" + index} // Unique key for each product row
              refresh={refresh} // Pass refresh function to child component
              {...product} // Spread all product properties to pass them to ProductsTableItem
              onDelete={onDelete} // Pass delete function to child component
              onEdit={onEdit} // Pass edit function to child component
              categoryName={category ? category.name : ""} // Provide category name to the child component
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductsTable;
