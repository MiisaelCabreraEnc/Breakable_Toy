import { FunctionComponent } from "react";
import PaginationElement, {
  PaginationElementProps,
} from "../../atoms/PaginationElement/PaginationElement";

/**
 * Props for the Pagination component.
 */
interface PaginationProps {
  totalPages: number; // Total number of pages available
  maxPages: number; // Maximum number of pages to show in pagination
  currentPage: number; // The current active page
  route: string; // The URL route for page navigation
}

/**
 * Pagination component to handle page navigation with dynamic page elements.
 *
 * - Generates pagination elements based on the current page and `maxPages`.
 * - Adds "previous" and "next" navigation buttons.
 * - Dynamically adds ellipsis (`...`) and next/previous tens for long page ranges.
 */
const Pagination: FunctionComponent<PaginationProps> = ({
  totalPages,
  maxPages,
  currentPage,
  route,
}) => {
  // Ensure maxPages doesn't exceed totalPages
  if (maxPages > totalPages) maxPages = totalPages;

  const elements: PaginationElementProps[] = [
    {
      href: route + "1", // First page button
      children: "<<",
      variant: "default",
    },
    {
      href: route + (currentPage - 1), // Previous page button
      children: "<",
      variant: currentPage === 1 ? "disabled" : "default",
    },
    {
      href: route + (currentPage + 1), // Next page button
      children: ">",
      variant: currentPage === totalPages ? "disabled" : "default",
    },
    {
      href: route + totalPages, // Last page button
      children: ">>",
      variant: "default",
    },
  ];

  const halfOfMaxElements = Math.ceil(maxPages / 2);

  // Function to add the next tens page to pagination
  const seedNextTenth = () => {
    const nextTenth = Math.ceil((currentPage + halfOfMaxElements) / 10) * 10;

    elements.splice(
      elements.length - 2,
      0,
      {
        href: "",
        children: "...", // Ellipsis to indicate skipped pages
        variant: "disabled",
      },
      {
        href: route + nextTenth,
        children: nextTenth,
        variant: "default",
      }
    );
  };

  // Function to add the previous tens page to pagination
  const seedPreviousTenth = () => {
    let previousTenth = 1;

    if (totalPages - currentPage <= halfOfMaxElements)
      previousTenth += Math.trunc((totalPages - maxPages - 1) / 10) * 10;
    else
      previousTenth +=
        Math.trunc(
          (currentPage - halfOfMaxElements - Math.ceil(maxPages / 10)) / 10
        ) * 10;

    elements.splice(
      elements.length - 2,
      0,
      {
        href: route + previousTenth,
        children: previousTenth,
        variant: "default",
      },
      {
        href: "",
        children: "...", // Ellipsis to indicate skipped pages
        variant: "disabled",
      }
    );
  };

  // Function to add a page number to the pagination elements
  const seedPage = (position: number) => {
    elements.splice(elements.length - 2, 0, {
      href: route + position,
      children: position.toString(),
      variant: currentPage === position ? "active" : "default",
    });
  };

  // Generate pagination based on the current page and maxPages
  if (currentPage < halfOfMaxElements + halfOfMaxElements / 2) {
    for (let i = 1; i <= maxPages; i++) {
      seedPage(i); // Generate pages at the start
    }
    if (totalPages > maxPages) seedNextTenth(); // Add next tens if needed
  } else if (currentPage < totalPages - halfOfMaxElements) {
    if (totalPages > maxPages) seedPreviousTenth(); // Add previous tens if needed
    for (
      let i = currentPage - Math.trunc(maxPages / 2);
      i < currentPage + maxPages / 2;
      i++
    ) {
      seedPage(i); // Generate pages around the current page
    }
    if (totalPages > maxPages) seedNextTenth(); // Add next tens if needed
  } else {
    if (totalPages > maxPages) seedPreviousTenth(); // Add previous tens if needed
    for (let i = totalPages - maxPages + 1; i <= totalPages; i++) {
      seedPage(i); // Generate pages at the end
    }
  }

  return (
    <div className="flex border px-8 mx-auto min-w-fit">
      {elements.map((element, index) => (
        <PaginationElement key={element.href + index} {...element} />
      ))}
    </div>
  );
};

export default Pagination;
