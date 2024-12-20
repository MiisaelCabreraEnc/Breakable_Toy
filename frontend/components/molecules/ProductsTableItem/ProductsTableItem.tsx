import Link from "next/link";
import { FunctionComponent } from "react";

export interface ProductsTableItemProps {
  id: number;
  category: string;
  name: string;
  price: number;
  expirationDate?: string;
  stock: number;
}

const TD_STYLE = "border text-center py-4";
const TD_BACKGROUND = {
  red: " bg-red-500 ",
  orange: " bg-orange-500 ",
  yellow: " bg-yellow-500 ",
  green: " bg-green-500 ",
};

const ProductsTableItem: FunctionComponent<ProductsTableItemProps> = ({
  id,
  category,
  name,
  price,
  expirationDate,
  stock,
}) => {
  let rowBackground = "";
  if (expirationDate) {
    const currentDate = new Date();
    const expiresIn = new Date(expirationDate);

    const timeBeforeExpires = expiresIn.getTime() - currentDate.getTime();
    const weekMiliseconds = 1000 * 60 * 60 * 24 * 7;
    rowBackground =
      timeBeforeExpires < weekMiliseconds
        ? TD_BACKGROUND["red"]
        : timeBeforeExpires > weekMiliseconds * 2
        ? TD_BACKGROUND["green"]
        : TD_BACKGROUND["yellow"];
  }
  const stockBackground =
    stock < 5
      ? TD_BACKGROUND["red"]
      : stock <= 10
      ? TD_BACKGROUND["orange"]
      : "";

  return (
    <tr className={rowBackground}>
      <td className={TD_STYLE}>
        <input type="checkbox" />
      </td>
      <td className={TD_STYLE}>{category}</td>
      <td className={TD_STYLE}>{name}</td>
      <td className={TD_STYLE}>{price}</td>
      <td className={TD_STYLE}>{expirationDate}</td>
      <td className={TD_STYLE + stockBackground}>{stock}</td>
      <td className={TD_STYLE}>
        {" "}
        <Link href={"edit/" + id}>edit</Link> / delete
      </td>
    </tr>
  );
};

export default ProductsTableItem;
