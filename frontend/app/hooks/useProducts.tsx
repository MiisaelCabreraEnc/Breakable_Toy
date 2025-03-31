import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts, getTotalProducts } from "../../services/products";
import { useParams } from "next/navigation";
import { getProductById } from "../../services/products";
import ProductFormProps from "../../interfaces/ProductFormProps";

export function useProducts() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product list and total count
  async function fetchProducts() {
    setLoading(true);
    setError(null);

    try {
      const params = searchParams.toString()
        ? `?${searchParams.toString()}`
        : "";
      const [productsData, totalProductsData] = await Promise.all([
        getProducts(params),
        getTotalProducts(),
      ]);

      if (productsData.error || totalProductsData.error) {
        throw new Error(productsData.error || totalProductsData.error);
      }

      setProducts(productsData);
      setTotalPages(Math.ceil(totalProductsData / 10));
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  return { products, totalPages, loading, error, fetchProducts };
}

export function useProduct(id?: string, props?: ProductFormProps) {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propsToSend, setPropsToSend] = useState({ ...props });
  const productId = id ?? params.id;

  // Fetch product details by ID
  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      if (!productId) return;
      const productData = await getProductById(productId);

      if (productData.error) throw new Error(productData.error);

      setPropsToSend({ ...propsToSend, productData });
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [params]);

  return { loading, error, propsToSend, productId, fetchData };
}
