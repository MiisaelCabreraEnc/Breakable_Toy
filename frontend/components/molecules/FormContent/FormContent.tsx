import { FunctionComponent, useEffect, useState } from "react";
import Input, { InputProps } from "../../atoms/Input/Input";
import Button, { ButtonElementProps } from "../../atoms/Button/Button";

interface FormContentProps {
  inputs: InputProps[];
  buttons: ButtonElementProps[];
  onSubmit: (formData: any) => void;
}

const FilterContent: FunctionComponent<FormContentProps> = ({
  inputs,
  buttons,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<{
    [key in (typeof inputs)[number]["name"]]: string | number;
  }>(
    inputs.reduce((acc, input) => {
      acc[input.name] = input.formValue ?? "";
      return acc;
    }, {} as { [key in (typeof inputs)[number]["name"]]: string | number })
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = isNaN(Number(value)) ? value : Number(value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="border w-full m-auto p-8" onSubmit={handleFormSubmit}>
      <div className=" flex flex-col ">
        <div className=" w-2/3 m-auto">
          {inputs.map((input, index) => (
            <Input
              disabled={
                formData["categoryId"] !== "" && input.name == "newCategory"
                  ? true
                  : false
              }
              key={input.name + index}
              value={formData[input.name]}
              onChange={handleChange}
              {...input}
            />
          ))}
        </div>
        <div className="flex justify-evenly m-auto w-1/2">
          {buttons.map((button, index) => (
            <Button key={button.as + "_" + index} {...button} />
          ))}
        </div>
      </div>
    </form>
  );
};

export default FilterContent;
