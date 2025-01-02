import { FunctionComponent } from "react";
import ProductsTableItem from "../../molecules/ProductsTableItem/ProductsTableItem";
import { ProductData } from "../../../app/page";
import OrderIcon from "../../atoms/Icons/OrderIcon/OrderIcon";

interface ProductsTableProps {
  categories: { id: number; name: string }[];
  products: ProductData[];
  onOrder: (orderBy: string) => void;
  onDelete: (id: number) => void;
}

const ProductsTable: FunctionComponent<ProductsTableProps> = ({
  products,
  categories,
  onOrder,
  onDelete,
}) => {
  return (
    <table className="border my-4">
      <thead>
        <tr>
          <th className="border py-4"></th>
          <th className=" py-4">
            <span className=" inline-flex items-center">
              Category
              <OrderIcon
                onClick={() => onOrder("category")}
                className="text-white h-4 w-4 ml-1 cursor-pointer"
              />
            </span>
          </th>
          <th className="border py-4">
            <span className=" inline-flex items-center">
              Name
              <OrderIcon
                onClick={() => onOrder("name")}
                className="text-white h-4 w-4 ml-1 cursor-pointer"
              />
            </span>
          </th>
          <th className="border py-4">
            <span className=" inline-flex items-center">
              Price
              <OrderIcon
                onClick={() => onOrder("price")}
                className="text-white h-4 w-4 ml-1 cursor-pointer"
              />
            </span>
          </th>
          <th className="border py-4">
            <span className=" inline-flex items-center">
              Expiration Date
              <OrderIcon
                onClick={() => onOrder("expirationDate")}
                className="text-white h-4 w-4 ml-1 cursor-pointer"
              />
            </span>
          </th>
          <th className="border py-4">
            <span className=" inline-flex items-center">
              Stock
              <OrderIcon
                onClick={() => onOrder("stock")}
                className="text-white h-4 w-4 ml-1 cursor-pointer"
              />
            </span>
          </th>
          <th className="border py-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => {
          const category = categories.find((category) => {
            return category.id === product.categoryId;
          });
          return (
            <ProductsTableItem
              key={"product_" + index}
              {...product}
              onDelete={onDelete}
              categoryName={category ? category.name : ""}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductsTable;
