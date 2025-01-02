"use client";
import { FunctionComponent, useEffect, useState } from "react";
import MetricsItem, {
  MetricsItemProps,
} from "../../molecules/MetricsItem/MetricsItem";

interface MetricsProps {
  metrics: MetricsItemProps[];
}

const Metrics: FunctionComponent<MetricsProps> = ({ metrics }) => {
  const [allMetrics, setAllMetrics] = useState<MetricsItemProps[]>(metrics);

  useEffect(() => {
    const overall: MetricsItemProps = metrics.reduce(
      (acc, { productsInStock, stockValue, averagePrice }) => {
        acc.productsInStock += productsInStock;
        acc.stockValue += stockValue;
        return acc;
      },
      {
        category: "Overall",
        productsInStock: 0,
        stockValue: 0,
        averagePrice: 0,
      }
    );

    overall.averagePrice = parseFloat(
      (overall.stockValue / overall.productsInStock).toFixed(2)
    );

    setAllMetrics((prevMetrics) => {
      const index = prevMetrics.findIndex(
        (metric) => metric.category === "Overall"
      );

      if (index !== -1) {
        const updatedMetrics = [...prevMetrics];
        return updatedMetrics;
      } else {
        return [...prevMetrics, overall];
      }
    });
  }, [metrics]);

  return (
    <table className="border w-10/12 mx-auto my-8">
      <thead>
        <tr>
          <th className="py-4">Category</th>
          <th className="py-4">Total Products In Stock</th>
          <th className="py-4">Total Value In Stock</th>
          <th className="py-4">Average Price In Stock</th>
        </tr>
      </thead>
      <tbody>
        {allMetrics.map((metric) => (
          <MetricsItem key={metric.category} {...metric} />
        ))}
      </tbody>
    </table>
  );
};

export default Metrics;
