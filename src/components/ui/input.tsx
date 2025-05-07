import * as React from "react"
import { Info, Eye, EyeOff } from "lucide-react"
import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tooltip?: string;
  error?: string;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  togglePasswordVisibility?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, tooltip, error, type, isPassword, isPasswordVisible, togglePasswordVisibility, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Use external state if provided, otherwise use internal state
    const isVisible = togglePasswordVisibility ? isPasswordVisible : showPassword;
    
    const handleTogglePassword = () => {
      if (togglePasswordVisibility) {
        togglePasswordVisibility();
      } else {
        setShowPassword(!showPassword);
      }
    };

    // Handle date restrictions
    if (type === "date") {
      // Restrict future dates for DOB fields
      if (props.name?.toLowerCase().includes("dob") || props.id?.toLowerCase().includes("dob") || 
          props.name?.toLowerCase().includes("dateofbirth") || props.id?.toLowerCase().includes("dateofbirth")) {
        const today = new Date().toISOString().split('T')[0];
        props.max = today;
      }
      
      // Fix for today's date fields - should be readonly if it's specifically for "today's date"
      if (props.name?.toLowerCase().includes("today") || props.id?.toLowerCase().includes("today")) {
        props.readOnly = true;
        // Set to today's date if not already set
        if (!props.value) {
          props.value = new Date().toISOString().split('T')[0];
        }
      }
    }

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

        <div className="relative">
          <input
            type={isPassword ? (isVisible ? "text" : "password") : type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500 focus-visible:ring-red-500" : "",
              isPassword ? "pr-10" : "",
              className
            )}
            ref={ref}
            aria-required={required}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
