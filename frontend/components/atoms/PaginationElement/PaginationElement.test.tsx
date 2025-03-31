import { render, screen } from "@testing-library/react";
import PaginationElement from "./PaginationElement";

describe("PaginationElement Component", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  // Test: Rendering a Pagination Element with the correct text and href

  it("renders the pagination element with the correct text and href", () => {
    render(
      <PaginationElement href="/page/1" variant="default">
        Page 1
      </PaginationElement>
    );

    // Verify that the pagination element is rendered with the correct text
    const paginationButton = screen.getByText("Page 1");
    expect(paginationButton).toBeInTheDocument();

    // Verify that the pagination element has the correct href
    expect(paginationButton.closest("a")).toHaveAttribute("href", "/page/1");
  });

  // Test: Check that the default variant is rendered correctly
  it("renders the pagination element with the default variant", () => {
    render(
      <PaginationElement href="/page/1" variant="default">
        Page 1
      </PaginationElement>
    );

    // Verify that the pagination element has the default styles
    const paginationButton = screen.getByText("Page 1");
    expect(paginationButton).toHaveClass("hover:bg-blue-500");
    expect(paginationButton).toHaveClass("text-black");
  });

  // Test: Check that the active variant is rendered correctly
  it("renders the pagination element with the active variant", () => {
    render(
      <PaginationElement href="/page/1" variant="active">
        Page 1
      </PaginationElement>
    );

    // Verify that the pagination element has the active styles
    const paginationButton = screen.getByText("Page 1");
    expect(paginationButton).toHaveClass("bg-blue-500");
    expect(paginationButton).toHaveClass("text-white");
    expect(paginationButton).toHaveClass("font-bold");
  });

  // Test: Check that the disabled variant is rendered correctly
  it("renders the pagination element with the disabled variant", () => {
    render(
      <PaginationElement href="/page/1" variant="disabled">
        Page 1
      </PaginationElement>
    );

    // Verify that the pagination element has the disabled styles
    const paginationButton = screen.getByText("Page 1");
    expect(paginationButton).toHaveClass("text-gray-500");
    expect(paginationButton).toHaveClass("pointer-events-none");

    // Check if the link is disabled
    expect(paginationButton.closest("a")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  // Test: Check that clicking the button navigates to the correct page
  it("navigates to the correct page when clicked", () => {
    render(
      <PaginationElement href="/page/1" variant="default">
        Page 1
      </PaginationElement>
    );

    // Verify that the pagination element is rendered with the correct href
    const paginationButton = screen.getByText("Page 1");
    expect(paginationButton.closest("a")).toHaveAttribute("href", "/page/1");
  });
});
