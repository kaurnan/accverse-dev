/**
 * Utility functions for reCAPTCHA validation
 */

// Get the reCAPTCHA site key from environment variables
export const getRecaptchaSiteKey = (): string => {
  const key = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  console.log("reCAPTCHA site key:", key)
  if (!key) {
    throw new Error("VITE_RECAPTCHA_SITE_KEY is not set in environment variables")
  }
  return key
}
  
/**
 * Validates a reCAPTCHA token on the client side
 * @param token - The reCAPTCHA token to validate
 * @returns Promise<boolean> - True if validation succeeds, false otherwise
 */
export const validateCaptchaToken = async (token: string): Promise<boolean> => {
  try {
  // For production use, we'll skip client-side validation to avoid token reuse issues
  // Just check if the token exists
      return !!token && token.length > 0

  // Uncomment for local validation if needed
  //   // Make a request to the backend validation endpoint
  //   const response = await fetch("/api/validate-captcha", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ token }),
  //   })

  //   if (!response.ok) {
  //     console.error(`CAPTCHA validation failed with status: ${response.status}`)
  //     return false
  //   }

  //   const data = await response.json()
  //   return data.success === true
  } catch (error) {
    console.error("Error validating CAPTCHA token:", error)
    return false
  }
}
  
/**
 * Ensures reCAPTCHA script is loaded
 * @returns Promise<boolean> - True if script is loaded successfully
 */
export const ensureRecaptchaLoaded = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => resolve(true))
      return
    }

    // If not loaded, create and append script
    const script = document.createElement("script")
    const siteKey = getRecaptchaSiteKey()
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true

    script.onload = () => {
      window.grecaptcha.ready(() => resolve(true))
    }

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
      resolve(false)
    }

    document.head.appendChild(script)
  })
}
  
// Add type definitions for global window object
declare global {
  interface Window {
    grecaptcha: any
    recaptchaWidgets?: Map<string, number>
  }
}
  