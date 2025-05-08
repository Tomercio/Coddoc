import { createContext, forwardRef, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const DropdownMenuContext = createContext({});

const DropdownMenu = ({ children, open, onOpenChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <DropdownMenuContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange }}
    >
      <div {...props}>{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = forwardRef(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useContext(DropdownMenuContext);

    return (
      <button
        ref={ref}
        className={cn("", className)}
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = forwardRef(
  ({ className, children, ...props }, ref) => {
    const { open } = useContext(DropdownMenuContext);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] rounded-md border border-border bg-popover p-1 shadow-md animate-in",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
