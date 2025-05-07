import React, { useRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorSummaryProps {
  errors: Record<string, string>;
  visible: boolean;
  excludeFields?: string[];
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({ errors, visible, excludeFields = [] }) => {
  const errorRef = useRef<HTMLDivElement>(null);
  // const errorCount = Object.keys(errors).length;
  
  const filteredErrors : Record<string, string> = Object.fromEntries(
    Object.entries(errors).filter(([field]) => !excludeFields.includes(field))
  );
  
  const errorCount = Object.keys(filteredErrors).length;

  if (!visible || errorCount === 0) return null;

  return (
    <div 
      ref={errorRef}
      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 animate-fade-in"
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      id="error-summary"
    >
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <div className="w-full">
          <p className="font-medium">Please correct {errorCount} {errorCount === 1 ? 'error' : 'errors'} before proceeding:</p>
          <ul className="mt-1 list-disc list-inside text-sm">
            {Object.entries(filteredErrors).map(([field, error], index) => (
              <li key={index} className="ml-2">
                <button 
                  type="button" 
                  className="text-left hover:underline focus:underline focus:outline-none"
                  onClick={() => {
                    const element = document.querySelector(`[name="${field}"], #${field}`);
                    if (element) {
                      (element as HTMLElement).focus();
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      
                      // Add highlight animation
                      element.classList.add('error-highlight');
                      setTimeout(() => {
                        element.classList.remove('error-highlight');
                      }, 2000);
                    }
                  }}
                  aria-controls={field}
                >
                  {error}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
