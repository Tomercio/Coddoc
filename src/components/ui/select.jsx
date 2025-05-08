import { createContext, forwardRef, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const SelectContext = createContext({});

const Select = ({ children, value, onValueChange, ...props }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleValueChange = (value) => {
    if (value === undefined) return;
    setSelectedValue(value);
    onValueChange?.(value);
  };

  return (
    <SelectContext.Provider
      value={{
        value: value !== undefined ? value : selectedValue,
        onValueChange: handleValueChange,
      }}
    >
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { value } = useContext(SelectContext);

  return (
    <button
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      {...props}
    >
      {children || <SelectValue />}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
      {isOpen && <SelectContent />}
    </button>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectContent = forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in",
          position === "popper" && "absolute mt-1 w-full",
          className
        )}
        {...props}
      >
        <div className="w-full p-1">{children}</div>
      </div>
    );
  }
);

SelectContent.displayName = "SelectContent";

const SelectValue = forwardRef(
  ({ className, placeholder = "בחר אפשרות", ...props }, ref) => {
    const { value } = useContext(SelectContext);

    return (
      <span ref={ref} className={cn("block truncate", className)} {...props}>
        {value || placeholder}
      </span>
    );
  }
);

SelectValue.displayName = "SelectValue";

const SelectItem = forwardRef(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useContext(SelectContext);
    const isSelected = selectedValue === value;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          isSelected && "bg-accent text-accent-foreground",
          className
        )}
        onClick={() => onValueChange(value)}
        role="option"
        aria-selected={isSelected}
        {...props}
      >
        {isSelected && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        )}
        {children || value}
      </div>
    );
  }
);

SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectContent, SelectValue, SelectItem };
