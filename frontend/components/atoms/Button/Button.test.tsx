import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

// Test to verify if the button with "primary" variant renders correctly
describe("Button Component", () => {
  it("renders a button with primary variant", () => {
    render(
      <Button as="button" variant="primary">
        Click Me
      </Button>
    );

    // Verifies if the button has the correct text
    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();

    // Verifies if the button has the correct class for primary style
    expect(button).toHaveClass("bg-blue-500");
  });

  // Test to verify if the link with "secondary" variant renders correctly
  it("renders a link with secondary variant", () => {
    render(
      <Button as="link" variant="secondary" href="/about">
        Go to About
      </Button>
    );

    // Verifies if the link has the correct text
    const link = screen.getByText("Go to About");
    expect(link).toBeInTheDocument();

    // Verifies if the link has the correct class for secondary style
    expect(link).toHaveClass("bg-gray-500");

    // Verificar que el enlace tiene el atributo href correcto
    // Verifies if the link has the correct href attribute
    expect(link).toHaveAttribute("href", "/about");
  });

  // Test to verify if the button triggers the onClick event correctly
  it("handles click event", () => {
    const handleClick = jest.fn(); // Mock function
    render(
      <Button as="button" variant="primary" onClick={handleClick}>
        Click Me
      </Button>
    );

    const button = screen.getByText("Click Me");
    fireEvent.click(button); // Simulates the button click

    // Verifies if the onClick function was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test to verify if the button type is "button" by default
  it('button type is "button" by default', () => {
    render(
      <Button as="button" variant="primary">
        Click Me
      </Button>
    );

    const button = screen.getByText("Click Me");
    expect(button).toHaveAttribute("type", "button");
  });

  // Test to verify if the button type is set when passed as a prop
  it('button type can be set to "submit"', () => {
    render(
      <Button as="button" variant="primary" typeof="submit">
        Submit
      </Button>
    );

    const button = screen.getByText("Submit");
    expect(button).toHaveAttribute("type", "submit");
  });
});
