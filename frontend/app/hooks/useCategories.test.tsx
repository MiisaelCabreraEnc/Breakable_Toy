import { renderHook, act } from "@testing-library/react";
import { useCategories } from "../hooks/useCategories";
import { getCategories } from "../../services/categories"; // Asegúrate de importar correctamente el servicio

import { FILTER_INPUTS } from "../../constants";

// Mock de `getCategories`
jest.mock("../../services/categories", () => ({
  getCategories: jest.fn(),
}));

describe("useCategories Hook", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("Must load categories correclty", async () => {
    // Simulamos una respuesta exitosa
    (getCategories as jest.Mock).mockResolvedValue([
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ]);

    // Renderizamos el hook
    const { result } = renderHook(() => useCategories(FILTER_INPUTS));

    // Esperamos a que `fetchCategories` se ejecute
    await act(async () => {
      await result.current.fetchCategories();
    });

    // Verificamos los resultados esperados
    expect(result.current.categories).toEqual([
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ]);

    if (result.current.filterInputs[1].as === "select")
      expect(result.current.filterInputs[1].options).toEqual([
        { children: "All", value: "0" },
        { children: "Category 1", value: "1" },
        { children: "Category 2", value: "2" },
      ]);

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("Must handle categories fetching error", async () => {
    // Simulamos un error en la API
    (getCategories as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useCategories(FILTER_INPUTS));

    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(result.current.categories).toEqual([]); // No debería haber categorías
    expect(result.current.error).toBe("Failed to load categories.");
    expect(result.current.loading).toBe(false);
  });

  test("Must start `loading` with `true` and then become to `false`", async () => {
    (getCategories as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useCategories(FILTER_INPUTS));

    expect(result.current.loading).toBe(true); // Inicialmente debe estar en true

    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(result.current.loading).toBe(false);
  });
});
