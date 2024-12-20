"use client";
import { useSearchParams } from "next/navigation";
import Form from "../components/organisms/Form/Form";
import Button from "../components/atoms/Button/Button";
import ProductsTable from "../components/organisms/ProductsTable/ProductsTable";
import Pagination from "../components/organisms/Pagination/Pagination";
import Metrics from "../components/organisms/Metrics/Metrics";

const FILTER_INPUTS = [
  {
    as: "text" as const,
    label: "Name: ",
    name: "Name",
  },
  {
    as: "select" as const,
    label: "Category: ",
    name: "category",
    options: [
      {
        children: "Option 1",
        value: "value1",
      },
      {
        children: "Option 2",
        value: "value2",
      },
    ],
  },
  {
    as: "select" as const,
    label: "Availability: ",
    name: "availability",
    options: [
      {
        children: "All",
        value: "",
      },
      {
        children: "In Stock",
        value: "true",
      },
      {
        children: "Out of stock",
        value: "false",
      },
    ],
  },
];

const FORM_BUTTONS = [
  {
    as: "button" as const,
    children: "Search",
    variant: "primary" as const,
  },
];

const EXAMPLE_PRODUCTS = [
  {
    id: 1,
    category: "option1",
    name: "papa",
    price: 9.9,
    expirationDate: "2024-12-14",
    stock: 2,
  },
  {
    id: 2,
    category: "option2",
    name: "televisión",
    price: 3999.99,
    expirationDate: "2024-12-21",
    stock: 15,
  },
  {
    id: 3,
    category: "option3",
    name: "chicle",
    price: 0.99,
    expirationDate: "2025-01-01",
    stock: 8,
  },
  {
    id: 4,
    category: "option3",
    name: "pelota",
    price: 0.99,
    stock: 1,
  },
  {
    id: 5,
    category: "option1",
    name: "papa",
    price: 9.9,
    expirationDate: "2024-12-14",
    stock: 2,
  },
  {
    id: 6,
    category: "option3",
    name: "chicle",
    price: 0.99,
    expirationDate: "2025-01-01",
    stock: 8,
  },
  {
    id: 7,
    category: "option3",
    name: "pelota",
    price: 0.99,
    stock: 1,
  },
  {
    id: 8,
    category: "option1",
    name: "papa",
    price: 9.9,
    expirationDate: "2024-12-30",
    stock: 2,
  },
  {
    id: 9,
    category: "option2",
    name: "televisión",
    price: 3999.99,
    expirationDate: "2024-12-31",
    stock: 15,
  },
  {
    id: 10,
    category: "option2",
    name: "televisión",
    price: 3999.99,
    expirationDate: "2024-12-21",
    stock: 15,
  },
];

const EXAMPLE_METRICS = [
  {
    category: "Food",
    productsInStock: 50,
    stockValue: 75,
    averagePrice: 1.5,
  },
  {
    category: "Clothing",
    productsInStock: 100,
    stockValue: 4500,
    averagePrice: 45,
  },
  {
    category: "Electronics",
    productsInStock: 0,
    stockValue: 0,
    averagePrice: 0,
  },
];

export default function Home() {
  const searchParams = useSearchParams();
  const queryPage = searchParams.get("page");
  const currentPage = queryPage ? parseInt(queryPage) : 1;

  return (
    <main className="flex items center flex-col  p-12 m-auto">
      <Form inputs={FILTER_INPUTS} buttons={FORM_BUTTONS} />
      <Button as="link" href="/new" variant="primary" className="">
        New Product
      </Button>

      <ProductsTable products={EXAMPLE_PRODUCTS} />

      <Pagination
        route="/?page="
        maxPages={5}
        totalPages={100}
        currentPage={currentPage}
      />

      <Metrics metrics={EXAMPLE_METRICS} />
    </main>
  );
}
