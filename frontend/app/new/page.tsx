"use client";

// Hooks
import { useMemo } from "react";
import { useFetchFormData } from "../hooks/useFetchFormData"; // Hook to get form data
import { useProductForm } from "../hooks/useProductForm"; // Hook to handle form submission

// Components
import FormContent from "../../components/molecules/FormContent/FormContent";
import Spinner from "../../components/atoms/Spinner/Spinner";
import ErrorMessage from "../../components/molecules/ErrorMessage/ErrorMessage";

// Interfaces
import { ButtonElementProps } from "../../components/atoms/Button/Button";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ProductForm({
  onCancel,
  refresh,
  productData,
  typeOfSubmit,
}: any) {
  // Determines the type of submit (create or update)
  const currentTypeOfSubmit = typeOfSubmit ?? "create";

  // Get the form data & error state
  const { inputs, loading, error, fetchData } = useFetchFormData(productData);

  // Handle the form submission
  const {
    handleCancel,
    handleSubmit,
    error: submitError,
  } = useProductForm(
    currentTypeOfSubmit,
    fetchData,
    productData?.id,
    refresh,
    onCancel
  );

  // UseMemo to avoid unnecessary re-renders
  const FORM_BUTTONS: ButtonElementProps[] = useMemo(
    () => [
      {
        as: "button",
        typeof: "submit",
        children: loading ? "Saving..." : "Save",
        variant: "primary",
        disabled: loading, // Disable button while processing
      },
      {
        as: "button",
        typeof: "button",
        children: "Cancel",
        onClick: handleCancel,
        variant: "secondary",
        disabled: loading, // Prevent cancel while loading
      },
    ],
    [handleCancel, loading]
  );

  return (
    <main className="flex items-center flex-col m-auto">
      {/* Show error message if fetching data fails */}
      {error && <ErrorMessage onClick={fetchData}>{error}</ErrorMessage>}

      {/* Show loading state while fetching */}
      {loading && (
        <Spinner className="border-8 m-auto mt-32 border-gray-600 text-gray-600 h-32 w-32" />
      )}

      {/* Show the form if there are no errors */}
      {!loading && !error && (
        <FormContent
          inputs={inputs}
          buttons={FORM_BUTTONS}
          onSubmit={handleSubmit}
        />
      )}

      {/* Show error message if form submission fails */}
      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
    </main>
  );
}
