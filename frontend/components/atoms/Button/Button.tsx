import { FunctionComponent, HtmlHTMLAttributes } from "react";
import Link from "next/link";

interface CommonProps {
  variant: "primary" | "secondary";
}

interface ButtonProps
  extends HtmlHTMLAttributes<HTMLButtonElement>,
    CommonProps {
  as: "button";
  onclick?: () => void;
}

interface LinkProps extends HtmlHTMLAttributes<HTMLAnchorElement>, CommonProps {
  as: "link";
  href: string;
}

export type ButtonElementProps = ButtonProps | LinkProps;

const BUTTON_STYLE =
  "  px-4 min-w-40 flex items-center justify-center py-2 rounded-full my-2 w-fit text-white transition-color ease-out duration-300 ";

const VARIANTS = {
  primary: " bg-blue-500 hover:bg-blue-600 ",
  secondary: " bg-gray-500 hover:bg-gray-600 ",
};

const Button: FunctionComponent<ButtonElementProps> = (props) => {
  const elementStyles =
    BUTTON_STYLE + props.className + VARIANTS[props.variant];

  if (props.as == "link") {
    return (
      <Link className={elementStyles} href={props.href}>
        {props.children}
      </Link>
    );
  }
  return (
    <button onClick={props.onclick} type="button" className={elementStyles}>
      {props.children}
    </button>
  );
};

export default Button;
