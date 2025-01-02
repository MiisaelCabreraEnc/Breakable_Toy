import { FunctionComponent } from "react";
import PaginationElement, {
  paginationElementProps,
} from "../../atoms/PaginationElement/PaginationElement";

interface PaginationProps {
  totalPages: number;
  maxPages: number;
  currentPage: number;
  route: string;
}

const Pagination: FunctionComponent<PaginationProps> = ({
  totalPages,
  maxPages,
  currentPage,
  route,
}) => {
  if (maxPages > totalPages) maxPages = totalPages;

  const elements: paginationElementProps[] = [
    {
      href: route + "1",
      children: "<<",
      variant: "default",
    },
    {
      href: route + (currentPage - 1),
      children: "<",
      variant: currentPage === 1 ? "disabled" : "default",
    },
    {
      href: route + (currentPage + 1),
      children: ">",
      variant: currentPage === totalPages ? "disabled" : "default",
    },
    {
      href: route + totalPages,
      children: ">>",
      variant: "default",
    },
  ];

  const halfOfMaxElements = Math.ceil(maxPages / 2);

  const seedNextTenth = () => {
    const nextTenth = Math.ceil((currentPage + halfOfMaxElements) / 10) * 10;

    elements.splice(
      elements.length - 2,
      0,
      {
        href: "",
        children: "...",
        variant: "disabled",
      },
      {
        href: route + nextTenth,
        children: nextTenth,
        variant: "default",
      }
    );
  };

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
        children: "...",
        variant: "disabled",
      }
    );
  };

  const seedPage = (position: number) => {
    elements.splice(elements.length - 2, 0, {
      href: route + position,
      children: position.toString(),
      variant: currentPage === position ? "active" : "default",
    });
  };

  if (currentPage < halfOfMaxElements + halfOfMaxElements / 2) {
    for (let i = 1; i <= maxPages; i++) {
      seedPage(i);
    }
    if (totalPages > maxPages) seedNextTenth();
  } else if (currentPage < totalPages - halfOfMaxElements) {
    if (totalPages > maxPages) seedPreviousTenth();
    for (
      let i = currentPage - Math.trunc(maxPages / 2);
      i < currentPage + maxPages / 2;
      i++
    ) {
      seedPage(i);
    }
    if (totalPages > maxPages) seedNextTenth();
  } else {
    if (totalPages > maxPages) seedPreviousTenth();
    for (let i = totalPages - maxPages + 1; i <= totalPages; i++) {
      seedPage(i);
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
