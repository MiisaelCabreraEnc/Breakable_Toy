import { FunctionComponent } from "react";
import ProductsTableItem, {
  ProductsTableItemProps,
} from "../../molecules/ProductsTableItem/ProductsTableItem";

interface ProductsTableProps {
  products: ProductsTableItemProps[];
}

const ProductsTable: FunctionComponent<ProductsTableProps> = ({ products }) => {
  return (
    <table className="border my-4">
      <thead>
        <tr>
          <th className="border py-4"></th>
          <th className="border py-4">Category</th>
          <th className="border py-4">Name</th>
          <th className="border py-4">Price</th>
          <th className="border py-4">Expiration Date</th>
          <th className="border py-4">Stock</th>
          <th className="border py-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <ProductsTableItem key={"product_" + index} {...product} />
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
