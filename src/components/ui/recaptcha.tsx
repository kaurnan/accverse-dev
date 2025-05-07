"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { storeWidgetId } from "../../utils/recaptcha-manager"

interface RecaptchaProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  theme?: "light" | "dark"
  size?: "normal" | "compact"
  className?: string
  id?: string
}

const Recaptcha: React.FC<RecaptchaProps> = ({
  siteKey,
  onVerify,
  onError,
  theme = "light",
  size = "normal",
  className = "",
  id = "g-recaptcha",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const scriptLoadedRef = useRef<boolean>(false)
  const renderAttemptsRef = useRef<number>(0)
  const maxRenderAttempts = 5

  useEffect(() => {
    // Load reCAPTCHA script if it's not already loaded
    if (!window.grecaptcha && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true
      const script = document.createElement("script")
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            setTimeout(renderCaptcha, 500)
          })
        } else {
          setTimeout(renderCaptcha, 500)
        }
      }
      script.onerror = () => {
        console.error("Error loading reCAPTCHA script")
        if (onError) onError()
      }
    } else if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        setTimeout(renderCaptcha, 500)
      })
    } else {
      setTimeout(renderCaptcha, 500)
    }

    return () => {
      // Clean up when component unmounts
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch (error) {
          console.error("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [siteKey, theme, size, id])

  const renderCaptcha = () => {
    // Wait for grecaptcha to be ready
    if (!window.grecaptcha || !window.grecaptcha.render) {
      if (renderAttemptsRef.current < maxRenderAttempts) {
        renderAttemptsRef.current++
        setTimeout(renderCaptcha, 500)
      } else {
        console.error("Failed to render reCAPTCHA after multiple attempts")
        if (onError) onError()
      }
      return
    }

    // Only render if container exists and widget hasn't been rendered yet
    if (containerRef.current && widgetIdRef.current === null) {
      try {
        // Clear the container first
        containerRef.current.innerHTML = ""
        // Define the callback function that will be called when the user completes the CAPTCHA
        const verifyCallback = (token: string) => {
            console.log("reCAPTCHA verification completed")
            onVerify(token)
        }

        const expiredCallback = () => {
            console.log("reCAPTCHA token expired")
            onVerify("") // Clear the token
            if (onError) onError()
        }

        // Render the reCAPTCHA widget
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme,
          size: size,
          callback: verifyCallback,
          "expired-callback": expiredCallback,
          "error-callback": onError,
        })

        // Store the widget ID for future reference
        if (id && widgetIdRef.current !== null) {
          storeWidgetId(id, widgetIdRef.current)
        }

        console.log(`reCAPTCHA widget rendered with ID: ${widgetIdRef.current}`)
      } catch (error) {
        console.error("Error rendering reCAPTCHA:", error)
        if (onError) onError()
      }
    }
  }

  return <div ref={containerRef} id={id} className={className} />
}

export default Recaptcha
