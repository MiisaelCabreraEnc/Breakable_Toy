import { render, screen } from "@testing-library/react";
import Metrics from "./Metrics"; // Importa el componente real
import MetricsItem from "../../molecules/MetricsItem/MetricsItem"; // Importamos el componente real

describe("Metrics Component", () => {
  const metrics = [
    {
      category: "Electronics",
      productsInStock: 10,
      stockValue: 1000,
      averagePrice: 100,
    },
    {
      category: "Clothing",
      productsInStock: 50,
      stockValue: 10000,
      averagePrice: 200,
    },
  ];

  const overallMetric = {
    category: "Overall",
    productsInStock: 150,
    stockValue: 15000,
    averagePrice: 100,
  };

  /**
   * Test: Renders the table with correct headings and data.
   */
  it("renders the table with correct headings and data", () => {
    render(<Metrics metrics={metrics} />);

    // Check if the column headings are rendered
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Total Products In Stock")).toBeInTheDocument();
    expect(screen.getByText("Total Value In Stock")).toBeInTheDocument();
    expect(screen.getByText("Average Price In Stock")).toBeInTheDocument();

    // Check if the MetricsItem is rendered for each metric
    expect(screen.getAllByText("Electronics")).toHaveLength(1);
    expect(screen.getAllByText("Clothing")).toHaveLength(1);
  });

  /**
   * Test: Calculates the overall metrics correctly.
   */
  it("calculates overall metrics correctly", () => {
    render(<Metrics metrics={metrics} />);

    // Check if the 'Overall' category is rendered
    expect(screen.getByText("Overall")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument(); // Total Products In Stock
    expect(screen.getByText("11000")).toBeInTheDocument(); // Total Value In Stock
    expect(screen.getByText("183.33")).toBeInTheDocument(); // Average Price In Stock
  });

  /**
   * Test: Does not add "Overall" category if already present.
   */
  it("does not add 'Overall' category if already present", () => {
    const existingMetrics = [...metrics, overallMetric];
    render(<Metrics metrics={existingMetrics} />);

    // Check if only one "Overall" category exists
    const overallCategory = screen.queryAllByText("Overall");
    expect(overallCategory).toHaveLength(1); // Only one "Overall" category should be displayed
  });

  /**
   * Test: Updates metrics when new data is provided.
   */
  it("updates metrics when new data is provided", () => {
    const newMetrics = [
      ...metrics,
      {
        category: "Toys",
        productsInStock: 2,
        stockValue: 5000,
        averagePrice: 2500,
      },
    ];

    render(<Metrics metrics={newMetrics} />);

    // Check that the new category "Toys" is rendered
    expect(screen.getByText("Toys")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // Total Products In Stock
    expect(screen.getByText("5000")).toBeInTheDocument(); // Total Value In Stock
    expect(screen.getByText("2500")).toBeInTheDocument(); // Average Price In Stock
  });
});
