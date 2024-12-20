import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";

export interface paginationElementProps {
  children: ReactNode;
  href: string;
  variant: "default" | "disabled" | "active";
}

const VARIANT = {
  disabled: " text-gray-500 pointer-events-none",
  active: " bg-blue-500 ",
  default: " hover:bg-blue-500",
};

const PaginationElement: FunctionComponent<paginationElementProps> = ({
  href,
  children,
  variant,
}) => {
  const style =
    "flex p-2  transition-all ease-in-out duration-300  " + VARIANT[variant];
  return (
    <Link className={style} href={href}>
      {children}
    </Link>
  );
};

export default PaginationElement;
