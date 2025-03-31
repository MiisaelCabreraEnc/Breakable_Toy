"use client";

// Hooks
import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import { useCategories } from "./hooks/useCategories";
import { usePagination } from "./hooks/usePagination";
import { useMetrics } from "./hooks/useMetrics";
import { deleteProduct } from "../services/products";

// Interfaces
import Filter from "../interfaces/FilterInterface";

// Components
import FormContent from "../components/molecules/FormContent/FormContent";
import Button from "../components/atoms/Button/Button";
import ProductsTable from "../components/organisms/ProductsTable/ProductsTable";
import Pagination from "../components/organisms/Pagination/Pagination";
import Metrics from "../components/organisms/Metrics/Metrics";
import Modal from "../components/molecules/Modal/Modal";
import ErrorMessage from "../components/molecules/ErrorMessage/ErrorMessage";
import Spinner from "../components/atoms/Spinner/Spinner";

// Constants
import {
  FILTER_INPUTS,
  FILTER_BUTTONS,
  MAX_PAGINATION_PAGES,
} from "../constants";

export default function Home() {
  const {
    products,
    totalPages,
    loading,
    error: productsError,
    fetchProducts,
  } = useProducts();
  const {
    categories,
    filterInputs,
    fetchCategories,
    error: categoriesError,
  } = useCategories(FILTER_INPUTS);
  const { currentPage, updateSearchParams } = usePagination();

  const { metrics, loadingMetrics, errorMetrics, fetchMetrics } = useMetrics(
    products,
    categories
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");
  const [productToEdit, setProductToEdit] = useState("");

  function handleFilterAndOrder(filterData: Filter) {
    updateSearchParams(filterData);
  }

  return (
    <main className="flex flex-col p-12 m-auto">
      {/* Filter Form */}
      <FormContent
        hasBorder
        onSubmit={handleFilterAndOrder}
        inputs={filterInputs}
        buttons={FILTER_BUTTONS}
      />

      {/* Open Create Form */}
      {!productsError && !categoriesError && !loading && (
        <Button
          as="button"
          onClick={() => {
            setIsModalOpen(true);
            setModalType("create");
          }}
          variant="primary" // Prevent opening while loading
        >
          New Product
        </Button>
      )}

      {/* Error messages */}
      {productsError && (
        <ErrorMessage onClick={fetchProducts}>{productsError}</ErrorMessage>
      )}

      {categoriesError && (
        <ErrorMessage onClick={fetchProducts}>{categoriesError}</ErrorMessage>
      )}

      {/* Modal for Creating/Updating Products */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        productId={productToEdit}
        refresh={() => {
          fetchCategories();
          fetchProducts();
        }}
      />

      {/* Product Table & Pagination */}
      {!loading && products.length > 0 ? (
        <>
          <ProductsTable
            onOrder={handleFilterAndOrder}
            onDelete={async (id) => {
              try {
                await deleteProduct(id);
                fetchProducts();
              } catch (err) {
                console.error("Error deleting product:", err);
              }
            }}
            refresh={fetchProducts}
            onEdit={(id) => {
              setModalType("update");
              setProductToEdit(id);
              setIsModalOpen(true);
            }}
            categories={categories}
            products={products}
          />
          <Pagination
            route="/?page="
            maxPages={MAX_PAGINATION_PAGES}
            totalPages={totalPages}
            currentPage={currentPage}
          />
          {!loadingMetrics && <Metrics metrics={metrics} />}
          {loadingMetrics && (
            <Spinner className="border-8 m-auto mt-32 border-gray-600 text-gray-300 h-32 w-32" />
          )}
          {errorMetrics && (
            <ErrorMessage onClick={fetchMetrics}>{errorMetrics}</ErrorMessage>
          )}
        </>
      ) : loading ? (
        <Spinner className="border-8 m-auto mt-32 border-gray-600 text-gray-300 h-32 w-32" />
      ) : (
        <p className="text-gray-600">No products found.</p>
      )}
    </main>
  );
}
