
import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "../../lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  tooltip?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, tooltip, error, required, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {tooltip && (
          <div className="absolute -top-0.5 right-0">
            <div className="group relative inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="Show information"
                tabIndex={-1}
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 right-0 bottom-full mb-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                {tooltip}
              </div>
            </div>
          </div>
        )}
        
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500" : "",
            className
          )}
          ref={ref}
          aria-required={required}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
