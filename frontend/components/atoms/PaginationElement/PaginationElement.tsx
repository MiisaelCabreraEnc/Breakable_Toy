import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";

/**
 * Props for the PaginationElement component.
 */
export interface PaginationElementProps {
  children: ReactNode; // The content inside the button (e.g., page number)
  href: string; // The URL to navigate to when clicked
  variant: "default" | "disabled" | "active"; // Defines the button's visual style
}

/**
 * CSS classes for different pagination states.
 */
const VARIANT = {
  disabled: "text-gray-500 pointer-events-none", // Grayed out, unclickable
  active: "bg-blue-500 text-white font-bold", // Highlighted as active
  default: "hover:bg-blue-500 text-black", // Normal state with hover effect
};

/**
 * Pagination button component that uses Next.js `<Link>`.
 *
 * - Supports different styles based on the `variant` prop.
 * - Uses `"disabled"` to prevent navigation when necessary.
 */
const PaginationElement: FunctionComponent<PaginationElementProps> = ({
  href,
  children,
  variant,
}) => {
  const style = `flex p-2 transition-all text-white ease-in-out duration-300  ${VARIANT[variant]}`;

  return (
    <Link className={style} href={href} aria-disabled={variant === "disabled"}>
      {children}
    </Link>
  );
};

export default PaginationElement;
