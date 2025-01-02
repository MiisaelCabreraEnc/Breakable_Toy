"use client";
import ProdctForm from "../../new/page";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PRODUCT = {
  id: 1,
  categoryId: 1,
  name: "string",
  price: 10,
  expirationDate: "2025-01-31",
  stock: 10,
};

export default function editProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [props, setProps] = useState({ handleSubmit }) as any;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(`http://localhost:9090/products/${id}`);
      const ProductData = await response.json();
      setProps({ ...props, ...ProductData });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: any) {
    console.log(formData);
    try {
      if (formData.categoryId === "") {
        console.log(formData.category, formData.newCategory);
        const categoryResponse = await fetch(
          "http://localhost:9090/categories",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: formData.newCategory }),
          }
        );
        const newCategory = await categoryResponse.json();
        formData.categoryId = newCategory.id;
      }

      const response = await fetch(`http://localhost:9090/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      router.push("/");
      router.refresh;
    } catch (error) {
      console.log(error);
    }
  }

  return <>{!loading && <ProdctForm {...props} />}</>;
}
