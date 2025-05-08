import { createContext, forwardRef, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext({});

const Tabs = ({ children, defaultValue, value, onValueChange, ...props }) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue);

  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setSelectedTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      value={{
        value: value !== undefined ? value : selectedTab,
        onValueChange: handleValueChange,
      }}
    >
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      role="tablist"
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = forwardRef(({ className, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      ref={ref}
      role="tab"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50 hover:text-foreground",
        className
      )}
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = forwardRef(({ className, value, ...props }, ref) => {
  const { value: selectedValue } = useContext(TabsContext);

  if (selectedValue !== value) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
