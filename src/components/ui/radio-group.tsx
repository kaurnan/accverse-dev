
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle, Info } from "lucide-react"

import { cn } from "../../lib/utils"

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  error?: string;
  required?: boolean;
  label?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, error, required, label, ...props }, ref) => {
  return (
    <div className="flex flex-col">
      {label && (
        <div className="flex items-center mb-2 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2", className)}
        {...props}
        ref={ref}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  tooltip?: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, tooltip, ...props }, ref) => {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "aspect-square h-5 w-5 rounded-full border-2 border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-3 w-3 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
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
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
