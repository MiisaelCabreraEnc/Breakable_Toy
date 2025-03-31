import { useCallback, useEffect, useState } from "react";
import Product from "../../interfaces/ProuctInterface";
import Category from "../../interfaces/CategoryInterface";
import Metric from "../../interfaces/MetricInterface";

// Services
import { getMetrics } from "../../services/metrics";

export function useMetrics(products: Product[], categories: Category[]) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [errorMetrics, setErrorMetrics] = useState<string | null>(null);

  const changeMetricsCategories = (metrics: Metric[]) => {
    const updatedMetrics = metrics.map((metric) => ({
      ...metric,
      category:
        categories.find((category) => category.id === metric.category)?.name ||
        metric.category,
    }));
    return updatedMetrics;
  };

  const fetchMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    setErrorMetrics(null);

    try {
      const metricsData = await getMetrics();
      if (metricsData.error) throw new Error(metricsData.error);

      const updatedMetrics = await changeMetricsCategories(metricsData);

      setMetrics(updatedMetrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setErrorMetrics("Failed to load metrics.");
    } finally {
      setLoadingMetrics(false);
    }
  }, [products, categories]);

  useEffect(() => {
    fetchMetrics();
  }, [products, categories]);

  return { metrics, loadingMetrics, errorMetrics, fetchMetrics };
}
