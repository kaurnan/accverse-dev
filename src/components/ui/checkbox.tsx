
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Info } from "lucide-react"

import { cn } from "../../lib/utils"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  tooltip?: string;
  error?: string;
  required?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, tooltip, error, required, children, ...props }, ref) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          error ? "border-red-500" : "",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      
      {children}
      
      {required && <span className="text-red-500">*</span>}
      
      {tooltip && (
        <div className="group relative">
          <button
            type="button"
            className="text-blue-500"
            aria-label="Show information"
            tabIndex={-1}
          >
            <Info size={16} />
          </button>
          <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
            {tooltip}
          </div>
        </div>
      )}
    </div>
    
    {error && (
      <p className="mt-1 text-xs text-red-500 pl-7">{error}</p>
    )}
  </div>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
