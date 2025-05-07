
"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { registerWidget, unregisterWidget } from "../../utils/turnstile-manager"

export interface CloudflareTurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
  className?: string
  id?: string
}

// Define the turnstile callback before doing anything else
if (typeof window !== 'undefined' && !window.onloadTurnstileCallback) {
  window.onloadTurnstileCallback = function() {
    // Dispatch an event when Turnstile is loaded
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('turnstileLoaded'));
      console.log("Turnstile script loaded successfully");
    }
  };
}

const CloudflareTurnstile: React.FC<CloudflareTurnstileProps> = ({
  siteKey,
  onVerify,
  onError,
  theme = "light",
  size = "normal",
  className = "",
  id = `turnstile-${Math.random().toString(36).substring(2, 11)}`, // Generate random ID if not provided
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [scriptLoading, setScriptLoading] = useState(false)

  // Check if Turnstile script is already loaded
  useEffect(() => {
    // If the script is already loading, don't try to load it again
    if (scriptLoading) return

    // If turnstile is already available, set isScriptLoaded to true
    if (typeof window !== 'undefined' && window.turnstile) {
      console.log("Turnstile already available on page load");
      setIsScriptLoaded(true)
      return
    }

    // Set scriptLoading to true to prevent multiple script loads
    setScriptLoading(true)
    console.log("Starting to load Turnstile script");

    // Add event listener for turnstileLoaded event
    const handleScriptLoaded = () => {
      console.log("Turnstile loaded event received");
      setIsScriptLoaded(true)
      setScriptLoading(false)
    };
    
    window.addEventListener('turnstileLoaded', handleScriptLoaded);
    
    // Load Turnstile script if not already loaded
    const existingScript = document.querySelector('script[src*="turnstile/v0/api.js"]');
    if (!existingScript) {
      console.log("Injecting Turnstile script");
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback"
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    } else {
      console.log("Turnstile script already exists in DOM");
    }

    return () => {
      // Clean up the event listener
      window.removeEventListener('turnstileLoaded', handleScriptLoaded);
      
      // Don't remove the script on component unmount as other components might need it
    }
  }, [scriptLoading])

  // Clean up function to reset widget when component unmounts
  useEffect(() => {
    return () => {
      if (widgetIdRef.current && typeof window !== 'undefined' && window.turnstile) {
        try {
          console.log(`Component unmounting, cleaning up widget: ${widgetIdRef.current}`);
          window.turnstile.reset(widgetIdRef.current)
          // If the component is unmounting, unregister the widget
          if (id) {
            unregisterWidget(id)
          }
        } catch (error) {
          console.error("Error resetting Turnstile widget:", error)
        }
      }
    }
  }, [id])

  // Render the Turnstile widget once the script is loaded
  useEffect(() => {
    // Only proceed if script is loaded, container exists, and we don't already have a widget ID
    if (isScriptLoaded && containerRef.current && typeof window !== 'undefined' && window.turnstile && !widgetIdRef.current) {
      // Clear any existing content in the container
      if (containerRef.current.firstChild) {
        containerRef.current.innerHTML = ""
      }

      try {
        // Set a small timeout to ensure DOM is ready
        const timeoutId = setTimeout(() => {
          if (!containerRef.current) return;
          
          console.log(`Rendering Turnstile widget in container: ${id}`)
          
          // Render the widget
          const turnstileOptions = {
            sitekey: siteKey,
            theme,
            size,
            callback: (token: string) => {
              console.log("CAPTCHA verified successfully");
              onVerify(token)
            },
            "expired-callback": () => {
              console.log("CAPTCHA token expired, resetting");
              if (widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current)
              }
            },
            "error-callback": () => {
              console.log("CAPTCHA encountered an error");
              if (onError) onError()
            },
            // Use interaction-only appearance to require user action
            appearance: "interaction-only" as "interaction-only"
          }
          
          widgetIdRef.current = window.turnstile?.render(containerRef.current, turnstileOptions) ?? null

          // Register the widget in our manager
          if (widgetIdRef.current && id) {
            registerWidget(id, widgetIdRef.current)
          }
        }, 300);  // Small delay to ensure DOM readiness

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error rendering Turnstile widget:", error)
      }
    }
  }, [isScriptLoaded, siteKey, theme, size, onVerify, onError, id])

  return (
    <div
      ref={containerRef}
      className={`cf-turnstile ${className} flex justify-center my-4`}
      data-testid="cloudflare-turnstile"
      id={id}
    >
      {!isScriptLoaded && (
        <div className="flex items-center justify-center p-4 text-sm text-gray-500">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading security verification...
        </div>
      )}
    </div>
  )
}

export default CloudflareTurnstile
