import { FunctionComponent, HtmlHTMLAttributes } from "react";
import FormContent from "../../molecules/FormContent/FormContent";
import { InputProps } from "@/components/atoms/Input/Input";
import { ButtonElementProps } from "../../atoms/Button/Button";

interface FormProps extends HtmlHTMLAttributes<HTMLFormElement> {
  inputs: InputProps[];
  buttons: ButtonElementProps[];
}

const Form: FunctionComponent<FormProps> = ({ inputs, buttons }) => {
  return (
    <form className="border w-full my-4 m-auto p-8" action="">
      <FormContent inputs={inputs} buttons={buttons} />
    </form>
  );
};

export default Form;
