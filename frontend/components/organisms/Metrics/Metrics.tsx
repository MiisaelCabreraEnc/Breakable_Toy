"use client";

import { FunctionComponent, useEffect, useState } from "react";
import Metric from "../../../interfaces/MetricInterface";
import MetricsItem from "../../molecules/MetricsItem/MetricsItem";

/**
 * Props for the Metrics component.
 */
interface MetricsProps {
  metrics: Metric[]; // List of metrics by category
}

/**
 * Displays inventory metrics in a table format.
 * - Aggregates data into an "Overall" category.
 * - Updates when new metrics are received.
 */
const Metrics: FunctionComponent<MetricsProps> = ({ metrics }) => {
  const [allMetrics, setAllMetrics] = useState<Metric[]>(metrics);

  /**
   * Calculates the "Overall" category metrics.
   * - Sums `productsInStock` and `stockValue` across all categories.
   * - Computes `averagePrice` as `stockValue / productsInStock`.
   */
  useEffect(() => {
    const overall: Metric = metrics.reduce(
      (acc, { productsInStock, stockValue }) => {
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

    // Calculate the average price, ensuring no division by zero.
    overall.averagePrice =
      overall.productsInStock > 0
        ? parseFloat((overall.stockValue / overall.productsInStock).toFixed(2))
        : 0;

    // Update the metrics list, ensuring "Overall" is added only once.
    setAllMetrics((prevMetrics) => {
      if (prevMetrics.some((metric) => metric.category === "Overall")) {
        return prevMetrics;
      }
      return [...prevMetrics, overall];
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
