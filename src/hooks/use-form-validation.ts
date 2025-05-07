"use client"

import { useState } from "react"

export function useFormValidation<T>(initialErrors: Record<string, string> = {}) {
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors)

  const validateField = (name: string, value: any, rules: Record<string, (value: any) => boolean>) => {
    for (const [ruleName, validationFn] of Object.entries(rules)) {
      if (!validationFn(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: getErrorMessage(ruleName, name),
        }))
        return false
      }
    }

    // Clear error if validation passes
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }

    return true
  }

  const clearError = (name: string) => {
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const setError = (name: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }))
  }

  const getErrorMessage = (rule: string, fieldName: string): string => {
    const fieldLabel = fieldName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

    switch (rule) {
      case "required":
        return `${fieldLabel} is required`
      case "email":
        return `Please enter a valid email address`
      case "phone":
        return `Please enter a valid phone number`
      case "postcode":
        return `Please enter a valid postcode (4 digits)`
      default:
        return `${fieldLabel} is invalid`
    }
  }

  return {
    errors,
    validateField,
    clearError,
    setError,
    setErrors,
  }
}
