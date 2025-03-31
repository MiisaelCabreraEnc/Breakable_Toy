import { FunctionComponent, HtmlHTMLAttributes } from "react";

/**
 * Defines an option for the `<select>` dropdown.
 */
interface Option {
  value: string;
  children: string;
}

/**
 * Common properties shared between text and select inputs.
 */
interface CommonProps {
  name: string; // Input name (used for forms)
  label: string; // Label text
  disabled?: boolean; // Whether the input is disabled
  value?: string | number; // Current value of the input
  formValue?: string | number; // Optional value for form submission
}

/**
 * Props for a `<select>` dropdown.
 */
interface SelectProps
  extends HtmlHTMLAttributes<HTMLSelectElement>,
    CommonProps {
  as: "select"; // Determines that it's a select element
  options: Option[]; // List of options for the select dropdown
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Change handler
}

/**
 * Props for a `<text>` input field.
 */
interface TextProps extends HtmlHTMLAttributes<HTMLInputElement>, CommonProps {
  as: "text"; // Determines that it's a text input
  placeholder?: string; // Placeholder text
  type?: string; // Input type (e.g., text, number, email)
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
}

/**
 * Union type that allows either a `<select>` or `<text>` input.
 */
export type InputProps = SelectProps | TextProps;

/**
 * Styles for the label.
 */
const LABEL_STYLES = "font-semibold mr-2 min-w-fit ";

/**
 * Styles for both input and select elements.
 */
const INPUT_STYLES =
  "text-black bg-white w-10/12 mr-4 focus:border-blue-500 outline-none border-2 transition-all duration-300 ease-in-out rounded-lg p-2 my-2 disabled:bg-gray-300 disabled:border-gray-500";

/**
 * A flexible Input component that supports both `<input>` and `<select>` elements.
 *
 * - **"as" prop** determines whether it renders an `<input>` or `<select>`.
 * - Handles user input and dropdown selections.
 * - Supports disabled states and dynamic values.
 */
const Input: FunctionComponent<InputProps> = (props) => {
  return (
    <div className="flex justify-between items-center">
      {/* Input label */}
      <label className={LABEL_STYLES} htmlFor={props.name}>
        {props.label}
      </label>

      {/* Render a text input if "as" is "text" */}
      {props.as === "text" ? (
        <input
          value={props.value}
          className={INPUT_STYLES}
          disabled={props.disabled}
          onChange={props.onChange}
          type={props.type ?? "text"} // Default type is "text"
          id={props.name}
          name={props.name}
          placeholder={props.placeholder} // Added support for placeholder
        />
      ) : (
        /* Render a select dropdown otherwise */
        <select
          value={props.value}
          className={INPUT_STYLES}
          disabled={props.disabled}
          onChange={props.onChange}
          name={props.name}
          id={props.name}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.children}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Input;
