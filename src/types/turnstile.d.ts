
interface Window {
  turnstile?: {
    render: (container: HTMLElement | string, options: TurnstileOptions) => string;
    reset: (widgetIdOrSelector?: string) => void;
    remove: (widgetId: string) => void;
    getResponse: (widgetId: string) => string | undefined;
  };
  onloadTurnstileCallback?: () => void;
}

interface TurnstileOptions {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  tabindex?: number;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  cData?: string;
  appearance?: "always" | "execute" | "interaction-only";
}

// To make TypeScript happy with document.getElementById
interface HTMLElement {
  turnstile?: any;
}
