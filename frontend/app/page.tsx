"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FormContent from "../components/molecules/FormContent/FormContent";
import Button from "../components/atoms/Button/Button";
import ProductsTable from "../components/organisms/ProductsTable/ProductsTable";
import Pagination from "../components/organisms/Pagination/Pagination";
import Metrics from "../components/organisms/Metrics/Metrics";

const FILTER_INPUTS = [
  {
    as: "text" as const,
    label: "Name: ",
    name: "name",
  },
  {
    as: "select" as const,
    label: "Category: ",
    name: "category",
    options: [],
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

const MAX_PAGES = 5;

export interface ProductData {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  expirationDate: string;
  stock: number;
  creationDate: string;
  updateDate: string;
}

interface CategoryData {
  id: number;
  name: string;
}

interface MetricData {
  category: string;
  productsInStock: number;
  stockValue: number;
  averagePrice: number;
}

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filterName = searchParams.get("name");
  const filterCategory = searchParams.get("category");
  const filterAvailability = searchParams.get("availability");
  const filterOrderedBy = searchParams.get("orderedBy");
  const queryPage = searchParams.get("page");
  const currentPage = queryPage ? parseInt(queryPage) : 1;

  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filterInputs, setFilterInputs] = useState(FILTER_INPUTS);
  const [totalPages, setTotalPages] = useState(1);
  const [metrics, setMetrics] = useState<MetricData[]>([]);

  async function fetchData() {
    const availability = filterAvailability ? filterAvailability : "";
    const name = filterName ? filterName : "";
    const category = filterCategory ? filterCategory : "";
    const orderedBy = filterOrderedBy ? filterOrderedBy : "";

    try {
      const productsResponse = await fetch(
        `http://localhost:9090/products?page=${
          currentPage - 1
        }&name=${name}&category=${category}&availability=${availability}&orderedBy=${orderedBy}`
      );
      const categoriesResponse = await fetch(
        "http://localhost:9090/categories"
      );

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      calculateMetrics(categoriesData, productsData.products);

      setProducts(productsData.products);
      setCategories(categoriesData);

      const newTotalPages = Math.ceil(productsData.totalProducts / 10);
      setTotalPages(newTotalPages);

      const updatedFilterInputs = [...FILTER_INPUTS];
      const categoryOptions = [
        {
          children: "All",
          value: "0",
        },
        ...categoriesData.map((category: CategoryData) => ({
          children: category.name,
          value: category.id.toString(),
        })),
      ];

      updatedFilterInputs[1].options = categoryOptions;
      setFilterInputs(updatedFilterInputs);
    } catch (error) {
      console.log(error);
    }
  }

  const calculateMetrics = (
    categories: CategoryData[],
    products: ProductData[]
  ) => {
    const newMetrics: MetricData[] = categories.map((category) => {
      const productsInCategory = products.filter(
        (product) => product.categoryId === category.id
      );

      const productsInStock = productsInCategory.reduce(
        (acc, product) => acc + product.stock,
        0
      );
      const stockValue = productsInCategory.reduce(
        (acc, product) => acc + product.price * product.stock,
        0
      );
      const averagePrice = parseFloat(
        (stockValue / productsInStock).toFixed(2)
      );

      return {
        category: category.name,
        productsInStock,
        stockValue,
        averagePrice,
      };
    });

    setMetrics(newMetrics);
  };

  const handleFilter = (filterData: any) => {
    const availability = filterData.availability ? filterData.availability : "";
    const name = filterData.name ? filterData.name : "";
    const category = filterData.category ? filterData.category : "";
    const orderedBy = filterOrderedBy ? filterOrderedBy : "";
    router.push(
      `/?page=${currentPage}&name=${name}&category=${category}&availability=${availability}&orderedBy=${orderedBy}`
    );
  };

  const handleOrder = (orderedBy: string) => {
    const availability = filterAvailability ? filterAvailability : "";
    const name = filterName ? filterName : "";
    const category = filterCategory ? filterCategory : "";
    router.push(
      `/?page=${currentPage}&name=${name}&category=${category}&availability=${availability}&orderedBy=${orderedBy}`
    );
  };

  const onDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:9090/products/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      console.log(result);

      if (result) fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  return (
    <main className="flex items center flex-col  p-12 m-auto">
      <FormContent
        onSubmit={handleFilter}
        inputs={filterInputs}
        buttons={FORM_BUTTONS}
      />
      <Button as="link" href="/new" variant="primary" className="">
        New Product
      </Button>

      {products.length > 0 && (
        <>
          <ProductsTable
            onOrder={handleOrder}
            onDelete={onDelete}
            categories={categories}
            products={products}
          />

          <Pagination
            route="/?page="
            maxPages={MAX_PAGES}
            totalPages={totalPages}
            currentPage={currentPage}
          />

          <Metrics metrics={metrics} />
        </>
      )}
    </main>
  );
}
