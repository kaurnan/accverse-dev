
/**
 * Helper function to reset all Turnstile widgets on the page
 * This can be useful when navigating between pages or when components unmount/remount
 */
export const resetAllTurnstileWidgets = (): void => {
  if (typeof window !== 'undefined' && window.turnstile && typeof window.turnstile.reset === "function") {
    try {
      // Find all Turnstile containers
      const containers = document.querySelectorAll(".cf-turnstile")

      if (containers.length === 0) {
        console.log("No Turnstile widgets found to reset")
        return
      }

      // Reset each container
      containers.forEach((container) => {
        // Get the iframe inside the container
        const iframe = container.querySelector("iframe")
        if (iframe) {
          // Extract widget ID from iframe name (format: cf-chl-widget-{widgetId})
          const iframeName = iframe.getAttribute("name")
          if (iframeName && iframeName.startsWith("cf-chl-widget-")) {
            const widgetId = iframeName.replace("cf-chl-widget-", "")
            try {
              if (window.turnstile) {
                window.turnstile.reset(widgetId)
                console.log(`Reset Turnstile widget: ${widgetId}`)
              }
            } catch (error) {
              console.error(`Error resetting individual widget: ${widgetId}`, error)
            }
          }
        }
      })

      // Also try a global reset as fallback
      try {
        if (window.turnstile) {
          window.turnstile.reset()
        }
      } catch (error) {
        console.error("Error performing global Turnstile reset:", error)
      }

      console.log("All Turnstile widgets reset attempt completed")
    } catch (error) {
      console.error("Error resetting Turnstile widgets:", error)
    }
  }
}

/**
 * Helper function to reset a specific Turnstile widget by container ID
 * @param containerId - The ID of the container element
 */
export const resetTurnstileWidgetById = (containerId: string): void => {
  if (!containerId) return
  
  if (typeof window !== 'undefined' && window.turnstile && typeof window.turnstile.reset === "function") {
    try {
      const container = document.getElementById(containerId)
      if (!container) {
        console.log(`Container with ID: ${containerId} not found`)
        return
      }
      
      // Get the iframe inside the container
      const iframe = container.querySelector("iframe")
      if (iframe) {
        // Extract widget ID from iframe name
        const iframeName = iframe.getAttribute("name")
        if (iframeName && iframeName.startsWith("cf-chl-widget-")) {
          const widgetId = iframeName.replace("cf-chl-widget-", "")
          try {
            if (window.turnstile) {
              window.turnstile.reset(widgetId)
              console.log(`Turnstile widget in container ${containerId} reset successfully`)
            }
          } catch (error) {
            // Try with the container ID as fallback
            try {
              if (window.turnstile) {
                window.turnstile.reset(`#${containerId}`)
                console.log(`Turnstile widget in container ${containerId} reset by container ID`)
              }
            } catch (innerError) {
              console.error(`All reset attempts for container ${containerId} failed`, innerError)
            }
          }
        }
      } else {
        // Try with the container ID as fallback
        try {
          if (window.turnstile) {
            window.turnstile.reset(`#${containerId}`)
            console.log(`Turnstile widget in container ${containerId} reset by container ID`)
          }
        } catch (error) {
          console.error(`Reset attempt for container ${containerId} failed`, error)
        }
      }
    } catch (error) {
      console.error(`Error resetting Turnstile widget in container ${containerId}:`, error)
    }
  }
}
