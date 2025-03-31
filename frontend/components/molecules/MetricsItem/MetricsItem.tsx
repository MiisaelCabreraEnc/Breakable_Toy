import { FunctionComponent } from "react";
import MetricInterface from "../../../interfaces/MetricInterface";

const TD_STYLE = "text-center py-4";

const MetricsItem: FunctionComponent<MetricInterface> = ({
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
