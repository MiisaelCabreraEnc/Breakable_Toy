"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputProps } from "@/components/atoms/Input/Input";
import FormContent from "../../components/molecules/FormContent/FormContent";

const INPUTS: InputProps[] = [
  {
    as: "text" as const,
    label: "Name",
    name: "name",
  },
  {
    as: "select" as const,
    label: "Category",
    name: "categoryId",
    options: [],
  },
  {
    as: "text" as const,
    label: "New category",
    name: "newCategory",
  },
  {
    as: "text" as const,
    label: "Stock",
    name: "stock",
    type: "number",
  },
  {
    as: "text" as const,
    label: "Unit Price",
    name: "price",
    type: "number",
  },
  {
    as: "text" as const,
    label: "Expiration Date",
    name: "expirationDate",
    type: "date",
  },
] as const;

interface CategoryData {
  id: number;
  name: string;
}

export default function ProdctForm(props: any) {
  const router = useRouter();

  const [inputs, setInputs] = useState(INPUTS);
  const [loading, setLoading] = useState(true);

  const handleCancel = () => {
    router.back();
  };

  async function fetchData() {
    try {
      const categoriesResponse = await fetch(
        "http://localhost:9090/categories"
      );
      const categoriesData = await categoriesResponse.json();

      const updatedInputs = inputs.map((input) => {
        const formValue = props[input.name] ? props[input.name] : "";
        return { ...input, formValue };
      });

      const options = [
        {
          children: "Create a new category",
          value: "",
        },
        ...categoriesData.map((category: CategoryData) => ({
          children: category.name,
          value: category.id.toString(),
        })),
      ];

      updatedInputs[1] = {
        as: "select" as const,
        label: "Category",
        name: "categoryId",
        options,
        formValue: props.categoryId ? props.categoryId : "",
      };

      setInputs(updatedInputs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const FORM_BUTTONS = [
    {
      as: "button" as const,
      children: "Save",
      variant: "primary" as const,
    },
    {
      as: "button" as const,
      typeof: "button" as const,
      children: "Cancel",
      onClick: props.handleCancel ?? handleCancel,
      variant: "secondary" as const,
    },
  ];

  async function handleSubmit(formData: any) {
    console.log(formData);
    try {
      if (formData.categoryId === "") {
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

      const response = await fetch("http://localhost:9090/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (props.refresh) {
        props.refresh();
        props.handleCancel();
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="flex items center flex-col m-auto">
      {!loading && (
        <FormContent
          inputs={inputs}
          buttons={FORM_BUTTONS}
          onSubmit={props.handleSubmit ?? handleSubmit}
        />
      )}
    </main>
  );
}
