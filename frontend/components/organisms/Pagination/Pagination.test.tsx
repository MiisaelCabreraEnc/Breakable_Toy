import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";
import { PaginationElementProps } from "../../atoms/PaginationElement/PaginationElement";

// Mocking PaginationElement to avoid unnecessary tests on the child component
jest.mock("../../atoms/PaginationElement/PaginationElement", () => ({
  __esModule: true,
  default: ({ children, variant }: PaginationElementProps) => (
    <div className={variant}>{children}</div>
  ),
}));

describe("Pagination Component", () => {
  const route = "/page/";

  it("renders the navigation buttons", () => {
    render(
      <Pagination totalPages={10} maxPages={5} currentPage={1} route={route} />
    );

    // Verifying that the navigation buttons exist
    expect(screen.getByText("<<")).toBeInTheDocument();
    expect(screen.getByText("<")).toBeInTheDocument();
    expect(screen.getByText(">")).toBeInTheDocument();
    expect(screen.getByText(">>")).toBeInTheDocument();
  });

  it("disables the previous button when on the first page", () => {
    render(
      <Pagination totalPages={10} maxPages={5} currentPage={1} route={route} />
    );

    expect(screen.getByText("<")).toHaveClass("disabled");
  });

  it("disables the next button when on the last page", () => {
    render(
      <Pagination totalPages={10} maxPages={5} currentPage={10} route={route} />
    );

    expect(screen.getByText(">")).toHaveClass("disabled");
  });

  it("renders correct number of page elements", () => {
    render(
      <Pagination totalPages={10} maxPages={5} currentPage={1} route={route} />
    );

    // Must be 5 page numbers, plus the navigation buttons
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("highlights the current page", () => {
    render(
      <Pagination totalPages={10} maxPages={5} currentPage={3} route={route} />
    );

    // The current page number should have the 'active' class
    expect(screen.getByText("3")).toHaveClass("active");
  });

  it("renders ellipsis when needed", () => {
    render(
      <Pagination totalPages={20} maxPages={5} currentPage={10} route={route} />
    );

    // Verifying that ellipsis are rendered correctly
    expect(screen.getAllByText("...")).toHaveLength(2);
  });

  it("does not show ellipsis when pages are within range", () => {
    render(
      <Pagination totalPages={5} maxPages={5} currentPage={3} route={route} />
    );

    // Should not show ellipsis if all pages fit in the pagination
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });
});
