import { render, screen, fireEvent } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";
import "@testing-library/jest-dom";

describe("ErrorMessage Component", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  // Test: Renders the error message with the correct text
  it("renders the error message with the correct text", () => {
    render(<ErrorMessage>Error loading data</ErrorMessage>);

    // Verifica si el mensaje de error se muestra correctamente
    const errorMessage = screen.getByText("Error: Error loading data");
    expect(errorMessage).toBeInTheDocument();
  });

  // Test: Renders the retry button when `onClick` is provided
  it("renders the retry button when onClick is provided", () => {
    const handleClick = jest.fn();
    render(
      <ErrorMessage onClick={handleClick}>Error loading data</ErrorMessage>
    );

    // Verifica si el botón de retry se muestra cuando onClick es proporcionado
    const retryButton = screen.getByText("Retry");
    expect(retryButton).toBeInTheDocument();
  });

  // Test: Does not render the retry button when `onClick` is not provided
  it("does not render the retry button when onClick is not provided", () => {
    render(<ErrorMessage>Error loading data</ErrorMessage>);

    // Verifica que el botón de retry no se renderiza cuando no hay onClick
    const retryButton = screen.queryByText("Retry");
    expect(retryButton).not.toBeInTheDocument();
  });

  // Test: Calls `onClick` when the retry button is clicked
  it("calls onClick when the retry button is clicked", () => {
    const handleClick = jest.fn();
    render(
      <ErrorMessage onClick={handleClick}>Error loading data</ErrorMessage>
    );

    // Simula el clic en el botón de retry
    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    // Verifica si la función onClick fue llamada
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
