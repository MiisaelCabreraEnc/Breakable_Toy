import { FunctionComponent, HtmlHTMLAttributes } from "react";

interface Option {
  value: string;
  children: string;
}

interface CommonProps {
  name: string;
  label: string;
}

interface SelectProps
  extends HtmlHTMLAttributes<HTMLSelectElement>,
    CommonProps {
  as: "select";
  options: Option[];
}

interface TextProps extends HtmlHTMLAttributes<HTMLInputElement>, CommonProps {
  as: "text";
  placeholder?: string;
  type?: string;
}

export type InputProps = TextProps | SelectProps;

const LABEL_STYLES = "font-semibold mr-2";
const INPUT_STYLES =
  "text-black bg-white w-10/12 mr-4 focus:border-blue-500 outline-none border-2 transition-all duration-300 ease-in-out rounded-lg p-2 my-2";

const Input: FunctionComponent<InputProps> = (props) => {
  if (props.as == "text") {
    return (
      <div className="flex justify-between items-center">
        <label className={LABEL_STYLES} htmlFor={props.name}>
          {props.label}
        </label>
        <input
          className={INPUT_STYLES}
          type={props.type}
          id={props.name}
          name={props.name}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <label className={LABEL_STYLES} htmlFor={props.name}>
        {props.label}
      </label>
      <select className={INPUT_STYLES} name={props.name} id={props.name}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.children}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Input;
