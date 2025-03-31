import { InputProps } from "./components/atoms/Input/Input";
import { ButtonElementProps } from "./components/atoms/Button/Button";
import FilterData from "./interfaces/FilterInterface";

// Inputs for the Filter form
export const FILTER_INPUTS: InputProps[] = [
  { as: "text", label: "Name:", name: "name" },
  {
    as: "select",
    label: "Category:",
    name: "category",
    options: [{ children: "All", value: "0" }],
  },
  {
    as: "select",
    label: "Availability:",
    name: "availability",
    options: [
      { children: "All", value: "" },
      { children: "In Stock", value: "true" },
      { children: "Out of stock", value: "false" },
    ],
  },
];

// Buttons for the Filter form
export const FILTER_BUTTONS: ButtonElementProps[] = [
  {
    as: "button",
    children: "Search",
    variant: "primary",
    typeof: "submit",
  },
];

// Maximum number of pages to show in the pagination component
export const MAX_PAGINATION_PAGES = 5;

export const PRODUCT_FORM_INPUTS: InputProps[] = [
  {
    as: "text",
    label: "Name",
    name: "name",
  },
  {
    as: "select",
    label: "Category",
    name: "categoryId",
    options: [],
  },
  {
    as: "text",
    label: "New category",
    name: "newCategory",
  },
  {
    as: "text",
    label: "Stock",
    name: "stock",
    type: "number",
  },
  {
    as: "text",
    label: "Unit Price $",
    name: "price",
    type: "number",
  },
  {
    as: "text",
    label: "Expiration Date",
    name: "expirationDate",
    type: "date",
  },
];

// Properties for the header of the ProductsTable component and order by types
interface OrderByType extends FilterData {
  name: string;
}
export const ORDER_BY_TYPES: OrderByType[] = [
  { name: "Category", orderedBy: "category" },
  { name: "Name", orderedBy: "name" },
  { name: "Price", orderedBy: "price" },
  { name: "Expiration Date", orderedBy: "expirationDate" },
  { name: "Stock", orderedBy: "stock" },
];
