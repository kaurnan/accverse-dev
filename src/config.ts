// src/config.ts
// This file loads the backend config (e.g., via an API call or environment variable) and exports it for frontend use.

const RECAPTCHA_SITE_KEY = import.meta.env.RECAPTCHA_SITE_KEY
if (!RECAPTCHA_SITE_KEY) {
  throw new Error("RECAPTCHA_SITE_KEY is not set in environment variables")
}

export const app_config = {
  RECAPTCHA_SITE_KEY
} 