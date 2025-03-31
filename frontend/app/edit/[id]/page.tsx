"use client";

//Hooks
import { useProduct } from "../../../app/hooks/useProducts";

//Components
import ProdctForm from "../../new/page";
import Spinner from "../../../components/atoms/Spinner/Spinner";
import ErrorMessage from "../../../components/molecules/ErrorMessage/ErrorMessage";

//Interfaces

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function EditProductPage({
  productId,
  refresh,
  onCancel,
  typeOfSubmit,
}: any) {
  const { loading, propsToSend, error, fetchData } = useProduct(productId, {
    onCancel,
    refresh,
    typeOfSubmit,
  });

  return (
    <>
      {!loading && !error && <ProdctForm {...propsToSend} />}
      {loading && (
        <Spinner className="border-8 m-auto mt-32 mx-auto flex border-gray-600 text-gray-600 h-32 w-32" />
      )}
      {error && (
        <main className="m-auto w-fit">
          <ErrorMessage onClick={fetchData}>{error}</ErrorMessage>
        </main>
      )}
    </>
  );
}
