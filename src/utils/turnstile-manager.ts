
/**
 * This utility manages Cloudflare Turnstile widget instances
 * to ensure proper cleanup and reset functionality
 */

// Store widget IDs for later reference
const widgetRegistry: Record<string, string> = {};

/**
 * Register a widget ID for a specific container
 * 
 * @param containerId The HTML container ID where the widget is rendered
 * @param widgetId The Turnstile widget ID returned from render
 */
export function registerWidget(containerId: string, widgetId: string): void {
  widgetRegistry[containerId] = widgetId;
  console.log(`Registered Turnstile widget: ${widgetId} for container: ${containerId}`);
}

/**
 * Unregister a widget by container ID
 * 
 * @param containerId The HTML container ID where the widget was rendered
 */
export function unregisterWidget(containerId: string): void {
  if (widgetRegistry[containerId]) {
    delete widgetRegistry[containerId];
    console.log(`Unregistered Turnstile widget for container: ${containerId}`);
  }
}

/**
 * Reset a widget by container ID
 * 
 * @param containerId The HTML container ID where the widget is rendered
 */
export function resetWidgetByContainerId(containerId: string): void {
  try {
    if (!containerId) return;
    
    // If we have a registered widget ID, use that for reset
    const widgetId = widgetRegistry[containerId];
    
    // First attempt: Reset by widget ID if available
    if (widgetId && typeof window !== 'undefined' && window.turnstile) {
      try {
        window.turnstile.reset(widgetId);
        console.log(`Reset Turnstile widget: ${widgetId} for container: ${containerId}`);
        return;
      } catch (error) {
        console.log(`Error resetting by widget ID, falling back to container selector`);
      }
    }

    // Second attempt: Reset by container ID, but only if element exists
    const container = document.getElementById(containerId);
    if (container && typeof window !== 'undefined' && window.turnstile) {
      try {
        console.log(`Attempted reset of Turnstile widget for container: ${containerId} using selector`);
        window.turnstile.reset(`#${containerId}`);
      } catch (error) {
        console.error(`Error resetting Turnstile by selector: ${error}`);
      }
    } else if (!container) {
      console.log(`Container with ID: ${containerId} not found. Skipping reset.`);
    }
  } catch (error) {
    console.error(`Error resetting Turnstile widget for container: ${containerId}`, error);
  }
}

/**
 * Reset all registered widgets
 */
export function resetAllWidgets(): void {
  if (typeof window !== 'undefined' && window.turnstile) {
    console.log("Attempting to reset all Turnstile widgets...");
    
    // Try specific resets first
    Object.entries(widgetRegistry).forEach(([containerId, widgetId]) => {
      try {
        window.turnstile?.reset(widgetId);
        console.log(`Reset Turnstile widget: ${widgetId} for container: ${containerId}`);
      } catch (error) {
        console.error(`Error resetting Turnstile widget: ${widgetId}`, error);
      }
    });
    
    // Then try global reset as backup
    try {
      window.turnstile.reset();
      console.log("Global Turnstile reset completed");
    } catch (error) {
      console.error("Error performing global Turnstile reset:", error);
    }
  }
}
