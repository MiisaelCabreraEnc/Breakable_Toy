import CategoryInterface from "./CategoryInterface";

export default interface MetricInterface {
  category: string;
  productsInStock: number;
  stockValue: number;
  averagePrice: number;
}
