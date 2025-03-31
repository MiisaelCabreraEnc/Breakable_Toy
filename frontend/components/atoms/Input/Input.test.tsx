import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input"; // Adjust the path according to your file structure

describe("Input Component", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  // Test: Rendering a text input
  it("renders a text input with the correct value and placeholder", () => {
    render(
      <Input
        as="text"
        name="username"
        label="Username"
        value="John Doe"
        placeholder="Enter your name"
      />
    );

    // Check if the input is rendered with the correct value
    const input = screen.getByPlaceholderText("Enter your name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("John Doe"); // The value should be 'John Doe'

    // Check if the placeholder is displayed correctly
    expect(input).toHaveAttribute("placeholder", "Enter your name");
  });

  // Test: Rendering a select input with options
  it("renders a select input with options", () => {
    const options = [
      { value: "1", children: "Option 1" },
      { value: "2", children: "Option 2" },
    ];

    render(
      <Input
        as="select"
        name="options"
        label="Choose an option"
        options={options}
      />
    );

    // Check if the select input is rendered with the correct options
    const select = screen.getByLabelText("Choose an option");
    expect(select).toBeInTheDocument();

    const option1 = screen.getByText("Option 1");
    const option2 = screen.getByText("Option 2");

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  // Test: Handling input change
  it("calls onChange when the input value is changed", () => {
    const handleChange = jest.fn();
    render(
      <Input
        as="text"
        name="username"
        label="Username"
        value="John Doe"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText("Username");

    fireEvent.change(input, { target: { value: "Jane Doe" } });

    // Check if the onChange handler was called
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Test: Handling select change
  it("calls onChange when a select option is selected", () => {
    const handleChange = jest.fn();
    const options = [
      { value: "1", children: "Option 1" },
      { value: "2", children: "Option 2" },
    ];

    render(
      <Input
        as="select"
        name="options"
        label="Choose an option"
        options={options}
        onChange={handleChange}
      />
    );

    const select = screen.getByLabelText("Choose an option");
    fireEvent.change(select, { target: { value: "2" } });

    // Check if the onChange handler was called
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Test: Checking if the input is disabled
  it("renders a disabled input", () => {
    render(
      <Input
        as="text"
        name="username"
        label="Username"
        value="John Doe"
        disabled
      />
    );

    const input = screen.getByLabelText("Username");

    // Check if the input is disabled
    expect(input).toBeDisabled();
  });

  // Test: Checking if the select input is disabled
  it("renders a disabled select input", () => {
    const options = [
      { value: "1", children: "Option 1" },
      { value: "2", children: "Option 2" },
    ];

    render(
      <Input
        as="select"
        name="options"
        label="Choose an option"
        options={options}
        disabled
      />
    );

    const select = screen.getByLabelText("Choose an option");

    // Check if the select input is disabled
    expect(select).toBeDisabled();
  });
});
