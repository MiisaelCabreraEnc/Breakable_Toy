import React, { FunctionComponent, HtmlHTMLAttributes } from "react";

const Spinner: FunctionComponent<HtmlHTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  return (
    <div
      className={
        className +
        " inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] "
      }
      {...rest}
      role="status"
    />
  );
};

export default Spinner;
