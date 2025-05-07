/**
 * Resets a specific reCAPTCHA widget by its container ID
 * @param containerId - The ID of the container element that holds the reCAPTCHA widget
 */
export const resetWidgetByContainerId = (containerId: string): void => {
    if (typeof window === "undefined") {
      console.warn("Window is not defined")
      return
    }
  
    if (!window.grecaptcha) {
      console.warn("reCAPTCHA not loaded yet")
      return
    }
  
    try {
      // Initialize recaptchaWidgets if it doesn't exist
      if (!window.recaptchaWidgets) {
        window.recaptchaWidgets = new Map<string, number>()
      }
  
      // Check if we have a widget ID for this container
      if (window.recaptchaWidgets && window.recaptchaWidgets.has(containerId)) {
        const widgetId = window.recaptchaWidgets.get(containerId)
        if (widgetId !== undefined) {
          window.grecaptcha.reset(widgetId)
          console.log(`reCAPTCHA widget in container ${containerId} has been reset`)
          return
        }
      }
  
      // If we don't have a specific widget ID, try to reset all widgets
      if (window.grecaptcha.reset) {
        window.grecaptcha.reset()
        console.log(`All reCAPTCHA widgets have been reset`)
      }
    } catch (error) {
      console.error(`Error resetting reCAPTCHA widget in container ${containerId}:`, error)
    }
  }
  
  /**
   * Resets all reCAPTCHA widgets on the page
   */
  export const resetAllWidgets = (): void => {
    if (typeof window === "undefined") {
      return
    }
  
    if (!window.grecaptcha) {
      console.warn("reCAPTCHA not loaded yet")
      return
    }
  
    const resetWithRetry = (widgetId?: number) => {
      return new Promise<void>((resolve) => {
        const attemptReset = () => {
          try {
            if (widgetId !== undefined) {
              window.grecaptcha.reset(widgetId)
            } else {
              window.grecaptcha.reset()
            }
            resolve()
          } catch (error) {
            console.warn(`Error resetting ${widgetId ? 'widget' : 'all widgets'}, retrying...`, error)
            setTimeout(attemptReset, 500)
          }
        }
        attemptReset()
      })
    }
  
    try {
      // Check if there are any widgets to reset
      if (window.recaptchaWidgets && window.recaptchaWidgets.size > 0) {
        // Reset each widget individually
        window.recaptchaWidgets.forEach((widgetId) => {
          resetWithRetry(widgetId)
        })
      } else {
        // If no specific widgets found, try global reset
        if (window.grecaptcha.reset) {
          resetWithRetry()
        }
      }
      console.log("All reCAPTCHA widgets have been reset")
    } catch (error) {
      console.error("Error resetting all reCAPTCHA widgets:", error)
    }
  }
  
  /**
   * Stores a widget ID for a specific container
   * @param containerId - The ID of the container element
   * @param widgetId - The reCAPTCHA widget ID
   */
  export const storeWidgetId = (containerId: string, widgetId: number): void => {
    if (typeof window === "undefined") {
      return
    }
  
    // Initialize recaptchaWidgets if it doesn't exist
    if (!window.recaptchaWidgets) {
      window.recaptchaWidgets = new Map<string, number>()
    }
  
    window.recaptchaWidgets.set(containerId, widgetId)
    console.log(`Stored widget ID ${widgetId} for container ${containerId}`)
  }
  