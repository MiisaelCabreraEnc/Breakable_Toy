"use client";
import Link from "next/link";
import { FunctionComponent, useState } from "react";
import EditIcon from "../../atoms/Icons/EditIcon/EditIcon";
import DeleteIcon from "../../atoms/Icons/DeleteIcon/DeleteIcon";

export interface ProductsTableItemProps {
  id: number;
  name: string;
  price: number;
  expirationDate: string;
  stock: number;
  creationDate: string;
  updateDate: string;
  categoryName: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TD_STYLE =
  "border text-center py-4 transition-all duration-300 ease-in-out";
const TD_BACKGROUND = {
  red: " bg-red-500 ",
  orange: " bg-orange-500 ",
  yellow: " bg-yellow-500 ",
  green: " bg-green-500 ",
};

const ProductsTableItem: FunctionComponent<ProductsTableItemProps> = ({
  id,
  categoryName,
  name,
  price,
  expirationDate,
  stock,
  onDelete,
  onEdit,
}) => {
  let rowBackground = "";
  const [currentStock, setCurrentStock] = useState(stock);
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
    currentStock < 5
      ? TD_BACKGROUND["red"]
      : currentStock <= 10
      ? TD_BACKGROUND["orange"]
      : "";

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const request = currentStock === 0 ? "instock" : "outofstock";
      const response = await fetch(
        `http://localhost:9090/products/${id}/${request}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const updatedProduct = await response.json();
      setCurrentStock(updatedProduct.stock);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr className={rowBackground}>
      <td className={TD_STYLE}>
        <input
          type="checkbox"
          onChange={handleChange}
          checked={currentStock === 0}
        />
      </td>
      <td className={TD_STYLE}>{categoryName}</td>
      <td className={TD_STYLE}>{name}</td>
      <td className={TD_STYLE}>{price}</td>
      <td className={TD_STYLE}>{expirationDate}</td>
      <td className={TD_STYLE + stockBackground}>{currentStock}</td>
      <td className={TD_STYLE}>
        <span className="flex mx-auto w-full  justify-evenly font-bold">
          <EditIcon
            onClick={() => onEdit(id)}
            className="h-6 w-6 text-white "
          />
          /{" "}
          <DeleteIcon
            onClick={() => onDelete(id)}
            className="h-6 w-6 text-white cursor-pointer"
          />
        </span>
      </td>
    </tr>
  );
};

export default ProductsTableItem;
