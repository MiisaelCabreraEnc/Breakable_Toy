import { render, screen } from "@testing-library/react";
import MetricsItem from "./MetricsItem";
import "@testing-library/jest-dom";

describe("MetricsItem Component", () => {
  const mockMetric = {
    category: { name: "Electronics", id: "1" },
    productsInStock: 50,
    stockValue: 5000,
    averagePrice: 100,
  };

  // Test: Renders the metric values correctly

  it("renders the correct metric values", () => {
    render(
      <table>
        <tbody>
          <MetricsItem {...mockMetric} />
        </tbody>
      </table>
    );

    // Verifies that each value is rendered in the table
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  // Test: Shows the data correctly when values are 0
  it("renders correctly when all values are zero", () => {
    const zeroMetric = {
      category: { name: "Empty Category", id: "2" },
      productsInStock: 0,
      stockValue: 0,
      averagePrice: 0,
    };

    render(
      <table>
        <tbody>
          <MetricsItem {...zeroMetric} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Empty Category")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(3); // Tres valores "0" en la tabla
  });
});
