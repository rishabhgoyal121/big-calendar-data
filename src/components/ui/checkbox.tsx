import * as React from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, ...props }, ref) => {
    React.useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.indeterminate = !!indeterminate;
      }
    }, [ref, indeterminate]);
    return (
      <input
        type="checkbox"
        ref={ref}
        className={
          "h-4 w-4 rounded border border-input bg-background text-brand-accent focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:cursor-not-allowed accent-brand-accent disabled:opacity-50 " +
          (className || "")
        }
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
