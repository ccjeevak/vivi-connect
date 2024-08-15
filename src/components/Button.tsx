import { cn } from "@/lib/utils";

const Button = ({className, ...props}:React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
      <button
        {...props}
        className={cn(
          buttonClassNames,
          className,
        )}
      />
    );
}
const buttonClassNames = "flex items-center justify-center gap-2 rounded-full bg-blue-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-600 disabled:bg-gray-200";
export {buttonClassNames};
export default Button;