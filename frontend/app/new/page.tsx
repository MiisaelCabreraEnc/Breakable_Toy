"use client";
import { useRouter } from "next/navigation";
import Form from "../../components/organisms/Form/Form";

const INPUTS = [
  {
    as: "text" as const,
    label: "Name",
    name: "name",
  },
  {
    as: "select" as const,
    label: "Category",
    name: "category",
    options: [],
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
];

export default function ProdctForm() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const FORM_BUTTONS = [
    {
      as: "button" as const,
      children: "Save",
      variant: "primary" as const,
    },
    {
      as: "button" as const,
      children: "Cancel",
      onclick: handleCancel,
      variant: "secondary" as const,
    },
  ];

  return (
    <main className="flex items center flex-col p-12 m-auto">
      <Form inputs={INPUTS} buttons={FORM_BUTTONS} />
    </main>
  );
}
