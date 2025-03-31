import { render, screen, fireEvent } from "@testing-library/react";
import FormContent from "./FormContent";
import "@testing-library/jest-dom";
import { InputProps } from "../../atoms/Input/Input";
import { ButtonElementProps } from "../../atoms/Button/Button";

describe("FormContent Component", () => {
  const mockInputs: InputProps[] = [
    { as: "text", name: "username", label: "Username", formValue: "" },
    {
      as: "select",
      name: "categoryId",
      label: "Category",
      options: [{ value: "1", children: "Category 1" }],
    },
    { as: "text", name: "newCategory", label: "New Category", formValue: "" },
  ];

  const mockButtons: ButtonElementProps[] = [
    { as: "button", children: "Submit", variant: "primary", typeof: "submit" },
  ];

  const mockOnSubmit = jest.fn();

  // Test: Renders the correct number of inputs and buttons
  it("renders the correct number of inputs and buttons", () => {
    render(
      <FormContent
        inputs={mockInputs}
        buttons={mockButtons}
        onSubmit={mockOnSubmit}
      />
    );

    // Verifies if the inputs are rendered correctly
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("New Category")).toBeInTheDocument();

    // Verifies if the button is rendered correctly
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  // Test: Handles input changes correctly
  it("updates state when input values change", () => {
    render(
      <FormContent
        inputs={mockInputs}
        buttons={mockButtons}
        onSubmit={mockOnSubmit}
      />
    );

    const usernameInput = screen.getByLabelText("Username");

    // Simulates the value change in the username input
    fireEvent.change(usernameInput, { target: { value: "JohnDoe" } });

    // Verifies that the input value has changed
    expect(usernameInput).toHaveValue("JohnDoe");
  });

  // Test: Disables "New Category" when "categoryId" has a value
  it("disables 'New Category' input when 'categoryId' is selected", () => {
    render(
      <FormContent
        inputs={mockInputs}
        buttons={mockButtons}
        onSubmit={mockOnSubmit}
      />
    );

    const categorySelect = screen.getByLabelText("Category");
    const newCategoryInput = screen.getByLabelText("New Category");

    // Simulates the selection of an existing category
    fireEvent.change(categorySelect, { target: { value: "1" } });

    // Verifies that the "New Category" input is disabled
    expect(newCategoryInput).toBeDisabled();
  });

  // Test: Calls onSubmit with the correct data when the form is submitted
  it("calls onSubmit with form data when submitted", () => {
    render(
      <FormContent
        inputs={mockInputs}
        buttons={mockButtons}
        onSubmit={mockOnSubmit}
      />
    );

    const usernameInput = screen.getByLabelText("Username");
    const form = screen.getByRole("form");

    // Simulates the change in the username input
    fireEvent.change(usernameInput, { target: { value: "JaneDoe" } });

    // Simulates the form submission
    fireEvent.submit(form);
    // Verifies that onSubmit is called with the correct values
    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: "JaneDoe",
      categoryId: "",
      newCategory: "",
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  // Test: Adds 'border' class when hasBorder is true
  it("adds 'border' class when hasBorder is true", () => {
    render(
      <FormContent
        inputs={mockInputs}
        buttons={mockButtons}
        onSubmit={mockOnSubmit}
        hasBorder
      />
    );

    const form = screen.getByRole("form");

    // Verifies that the form has the 'border' class
    expect(form).toHaveClass("border");
  });
});
