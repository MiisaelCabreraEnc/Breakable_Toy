const API_URL = process.env.NEXT_PUBLIC_API_URI;

export async function getMetrics() {
  try {
    const response = await fetch(`${API_URL}/products/metrics`);

    if (!response.ok) {
      throw new Error(`Error fetching metrics: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return { error: "Unable to fetch metrics." };
  }
}
