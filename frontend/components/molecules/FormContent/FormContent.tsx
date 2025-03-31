import { FunctionComponent, useState } from "react";
import Input, { InputProps } from "../../atoms/Input/Input";
import Button, { ButtonElementProps } from "../../atoms/Button/Button";

/**
 * Defines the props for the FormContent component.
 */
interface FormContentProps {
  inputs: InputProps[]; // List of input fields to render
  buttons: ButtonElementProps[]; // List of buttons for form actions
  onSubmit: (formData: Record<string, string | number>) => void; // Submission handler
  hasBorder?: boolean; // Optional prop to add border
}

/**
 * A dynamic form component that generates inputs and buttons from props.
 *
 * - Uses `useState` to manage form state.
 * - Handles form submission and resets values.
 * - Supports both text inputs and dropdowns.
 */
const FormContent: FunctionComponent<FormContentProps> = ({
  inputs,
  buttons,
  hasBorder,
  onSubmit,
}) => {
  /**
   * Initializes form state with input names as keys.
   * Defaults to `formValue` if available, otherwise an empty string.
   */
  const [formData, setFormData] = useState(
    inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.name]: input.formValue ?? "",
      }),
      {} as Record<string, string | number>
    )
  );

  /**
   * Handles input value changes and updates state accordingly.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * Handles form submission:
   * - Prevents default behavior.
   * - Calls `onSubmit` with the current form data.
   * - Resets form values after submission.
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      className={` w-full m-auto p-8 ${hasBorder ? "border" : ""}`}
      onSubmit={handleFormSubmit}
      aria-label="form-content"
    >
      <div className="flex flex-col">
        {/* Render input fields */}
        <div className="w-2/3 m-auto">
          {inputs.map((input, index) => (
            <Input
              key={`${input.name}_${index}`}
              value={formData[input.name]}
              onChange={handleChange}
              disabled={
                formData["categoryId"] !== "" && input.name === "newCategory"
              }
              {...input}
            />
          ))}
        </div>

        {/* Render form action buttons */}
        <div className="flex justify-evenly m-auto w-1/2">
          {buttons.map((button, index) => (
            <Button key={`${button.as}_${index}`} {...button} />
          ))}
        </div>
      </div>
    </form>
  );
};

export default FormContent;
