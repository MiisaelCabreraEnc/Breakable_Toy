import { FunctionComponent } from "react";

export interface MetricsItemProps {
  category: string;
  productsInStock: number;
  stockValue: number;
  averagePrice: number;
}

const TD_STYLE = "text-center py-4";

const MetricsItem: FunctionComponent<MetricsItemProps> = ({
  category,
  productsInStock,
  stockValue,
  averagePrice,
}) => {
  return (
    <tr>
      <td className={TD_STYLE}>{category}</td>
      <td className={TD_STYLE}>{productsInStock}</td>
      <td className={TD_STYLE}>{stockValue}</td>
      <td className={TD_STYLE}>{averagePrice}</td>
    </tr>
  );
};

export default MetricsItem;
