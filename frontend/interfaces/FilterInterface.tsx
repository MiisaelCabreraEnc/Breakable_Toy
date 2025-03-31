export default interface FilterData {
  page?: number;
  name?: string;
  category?: string;
  availability?: "true" | "false" | "";
  orderedBy?: "category" | "name" | "price" | "expirationDate" | "stock" | "";
}
