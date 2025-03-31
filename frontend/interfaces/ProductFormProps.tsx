import ProductInterface from "./ProuctInterface";

export default interface ProductFormProps {
  onCancel?: () => void;
  refresh?: () => void;
  productData?: ProductInterface;
  typeOfSubmit?: "create" | "update";
  productId?: string;
}
