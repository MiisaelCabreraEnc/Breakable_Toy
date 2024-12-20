import { FunctionComponent, ReactNode } from "react";
import Input, { InputProps } from "../../atoms/Input/Input";
import Button, { ButtonElementProps } from "../../atoms/Button/Button";

interface FormContentProps {
  inputs: InputProps[];
  buttons: ButtonElementProps[];
}

const FilterContent: FunctionComponent<FormContentProps> = ({
  inputs,
  buttons,
}) => {
  return (
    <div className=" flex flex-col ">
      <div className=" w-2/3 m-auto">
        {inputs.map((input) => (
          <Input key={input.name} {...input} />
        ))}
      </div>
      <div className="flex justify-evenly m-auto w-1/2">
        {buttons.map((button, index) => (
          <Button key={button.as + "_" + index} {...button} />
        ))}
      </div>
    </div>
  );
};

export default FilterContent;
