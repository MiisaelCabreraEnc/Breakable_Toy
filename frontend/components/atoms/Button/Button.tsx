import { FunctionComponent, HtmlHTMLAttributes } from "react";
import Link from "next/link";

/**
 * Common props shared between both Button and Link components.
 */
interface CommonProps {
  variant: "primary" | "secondary"; // Defines the button style variant
}

/**
 * Props for Button elements (`<button>`).
 */
interface ButtonProps
  extends HtmlHTMLAttributes<HTMLButtonElement>,
    CommonProps {
  as: "button"; // Determines that it's a button element
  onClick?: () => void; // Click handler
  typeof?: "button" | "submit" | "reset"; // Defines the button type
}

/**
 * Props for Link elements (`<a>` using `next/link`).
 */
interface LinkProps extends HtmlHTMLAttributes<HTMLAnchorElement>, CommonProps {
  as: "link"; // Determines that it's a link element
  href: string; // Destination URL
}

/**
 * Union type for both Button and Link props.
 */
export type ButtonElementProps = ButtonProps | LinkProps;

/**
 * Base styles for the button.
 */
const BUTTON_STYLE =
  "px-4 min-w-40 flex items-center justify-center py-2 rounded-full my-4 w-fit text-white transition-colors ease-out duration-300";

/**
 * Style variants for the button.
 */
const VARIANTS = {
  primary: "bg-blue-500 hover:bg-blue-600",
  secondary: "bg-gray-500 hover:bg-gray-600",
};

/**
 * A flexible Button component that supports both `<button>` and `<a>` elements.
 *
 * - **"as" prop** determines whether it renders a `<button>` or a `<Link>`.
 * - Supports primary and secondary styles.
 * - Handles click events if used as a button.
 * - Uses Next.js `<Link>` for navigation when used as a link.
 */
const Button: FunctionComponent<ButtonElementProps> = (props) => {
  // Compute styles dynamically
  const elementStyles = `${BUTTON_STYLE} ${VARIANTS[props.variant]} ${
    props.className || ""
  }`.trim();

  // Render a Link if `as` is "link"
  if (props.as === "link") {
    return (
      <Link className={elementStyles} href={props.href}>
        {props.children}
      </Link>
    );
  }

  // Render a Button otherwise
  return (
    <button
      onClick={props.onClick}
      type={props.typeof ?? "button"} // Default type is "button"
      className={elementStyles}
    >
      {props.children}
    </button>
  );
};

export default Button;
