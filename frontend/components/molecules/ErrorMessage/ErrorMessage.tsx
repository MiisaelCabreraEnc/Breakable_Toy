import { FunctionComponent, HtmlHTMLAttributes } from "react";
import Button from "../../atoms/Button/Button";
import AlertIcon from "../../atoms/Icons/AlertIcon/AlertIcon";

interface ErrorMessageProps extends HtmlHTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  children,
  onClick,
}) => {
  return (
    <div className="text-red-600 my-8 max-w-fit flex flex-col items-center">
      <span className="flex items-center">
        <AlertIcon className="text-yellow-500 w-6 h-6 mr-2" /> Error: {children}
      </span>
      {onClick && (
        <Button
          as="button"
          onClick={onClick}
          className="w-full"
          variant="secondary"
        >
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
