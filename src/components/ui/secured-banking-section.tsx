"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Label } from "./label"
import { Input } from "./input"
import { validateBSB, validateAccountNumber } from "../../utils/form-validation"
import { AlertCircle, Info, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface SecuredBankingSectionProps {
  formData: {
    bankBsb: string
    bankAccountNo: string
    bankAccountName: string
    bankName: string
    confirmAccountNo?: string
    [key: string]: string | undefined | null
  }

  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBsbChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAccountNoChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: Record<string, string>
  required?: boolean
}

export const SecuredBankingSection: React.FC<SecuredBankingSectionProps> = ({
  formData,
  handleChange,
  handleBsbChange,
  handleAccountNoChange,
  errors,
  required = true,
}) => {
  const [showAccountNo, setShowAccountNo] = useState(false)
  const [showConfirmAccountNo, setShowConfirmAccountNo] = useState(false)
  const [bsbFormatted, setBsbFormatted] = useState(formData.bankBsb || "")

  useEffect(() => {
    setBsbFormatted(formatBsb(formData.bankBsb || ""))
  }, [formData.bankBsb])

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "bankBsb") {
      // Remove non-numeric characters for validation
      const cleanedValue = value.replace(/[^\d]/g, "")
      const formattedBsb = formatBsb(value)
      setBsbFormatted(formattedBsb)

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: "bankBsb",
          // Use the cleaned value without dash for validation but display formatted
          value: cleanedValue.length > 0 ? cleanedValue : "",
        },
      } as React.ChangeEvent<HTMLInputElement>

      if (handleBsbChange) {
        handleBsbChange(syntheticEvent)
      } else {
        handleChange(syntheticEvent)
      }
      return
    }

    if ((name === "bankAccountNo" || name === "confirmAccountNo") && handleAccountNoChange) {
      // Allow only digits for account numbers
      const digitsOnly = value.replace(/[^\d]/g, "")

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: digitsOnly,
        },
      } as React.ChangeEvent<HTMLInputElement>

      handleAccountNoChange(syntheticEvent)
      return
    }

    handleChange(e)
  }

  const formatBsb = (value: string): string => {
    // Remove non-numeric characters
    const cleaned = value.replace(/[^\d]/g, "")

    // Return empty string if no digits
    if (cleaned.length === 0) return ""

    // Format with a dash after 3 digits only if we have more than 3 digits
    if (cleaned.length > 3) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}`
    }
    return cleaned
  }

  const toggleAccountNoVisibility = () => {
    setShowAccountNo(!showAccountNo)
  }

  const toggleConfirmAccountNoVisibility = () => {
    setShowConfirmAccountNo(!showConfirmAccountNo)
  }

  const accountsMatch =
    formData.bankAccountNo && formData.confirmAccountNo && formData.bankAccountNo === formData.confirmAccountNo

  const isValidBsb = formData.bankBsb && validateBSB(formData.bankBsb)
  const isValidAccountNo = formData.bankAccountNo && validateAccountNumber(formData.bankAccountNo)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group relative">
          <Label htmlFor="bankBsb" className="block text-gray-700 font-medium mb-2">
            BSB Number {required && <span className="text-red-500">*</span>}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Enter your 6-digit BSB number with a dash (e.g., 123-456)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <div className="relative">
            <Input
              type="text"
              id="bankBsb"
              name="bankBsb"
              value={bsbFormatted}
              onChange={handleCustomChange}
              required={required}
              maxLength={7} // 6 digits + 1 dash
              placeholder="e.g., 123-456"
              className={`${errors.bankBsb ? "border-red-500 pr-10" : "border-gray-300"} ${isValidBsb ? "pr-10" : ""}`}
              aria-invalid={errors.bankBsb ? "true" : "false"}
              aria-describedby={errors.bankBsb ? "bankBsb-error" : undefined}
            />
            {isValidBsb && !errors.bankBsb && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
            {errors.bankBsb && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
            )}
          </div>
          {errors.bankBsb && (
            <p id="bankBsb-error" className="mt-1 text-xs text-red-500">
              {errors.bankBsb}
            </p>
          )}
        </div>

        <div className="form-group">
          <Label htmlFor="bankName" className="block text-gray-700 font-medium mb-2">
            Bank Name {required && <span className="text-red-500">*</span>}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter the name of your banking institution</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <div className="relative">
            <Input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required={required}
              maxLength={50}
              placeholder="e.g., Commonwealth Bank"
              className={`${errors.bankName ? "border-red-500 pr-10" : "border-gray-300"} ${formData.bankName ? "pr-10" : ""}`}
              aria-invalid={errors.bankName ? "true" : "false"}
              aria-describedby={errors.bankName ? "bankName-error" : undefined}
            />
            {formData.bankName && !errors.bankName && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
            {errors.bankName && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
            )}
          </div>
          {errors.bankName && (
            <p id="bankName-error" className="mt-1 text-xs text-red-500">
              {errors.bankName}
            </p>
          )}
        </div>
      </div>

      <div className="form-group">
        <Label htmlFor="bankAccountNo" className="block text-gray-700 font-medium mb-2">
          Account Number {required && <span className="text-red-500">*</span>}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter your bank account number (6-10 digits)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="relative">
          <Input
            type={showAccountNo ? "text" : "password"}
            id="bankAccountNo"
            name="bankAccountNo"
            value={formData.bankAccountNo}
            onChange={handleCustomChange}
            required={required}
            maxLength={10}
            placeholder="Enter account number"
            className={`${errors.bankAccountNo ? "border-red-500 pr-10" : "border-gray-300"} ${isValidAccountNo ? "pr-10" : ""}`}
            aria-invalid={errors.bankAccountNo ? "true" : "false"}
            aria-describedby={errors.bankAccountNo ? "bankAccountNo-error" : undefined}
          />
          <button
            type="button"
            onClick={toggleAccountNoVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showAccountNo ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.bankAccountNo && (
          <p id="bankAccountNo-error" className="mt-1 text-xs text-red-500">
            {errors.bankAccountNo}
          </p>
        )}
      </div>

      {/* Confirm Account Number field */}
      <div className="form-group">
        <Label htmlFor="confirmAccountNo" className="block text-gray-700 font-medium mb-2">
          Confirm Account Number {required && <span className="text-red-500">*</span>}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Re-enter your bank account number to confirm</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="relative">
          <Input
            type={showConfirmAccountNo ? "text" : "password"}
            id="confirmAccountNo"
            name="confirmAccountNo"
            value={formData.confirmAccountNo || ""}
            onChange={handleCustomChange}
            required={required}
            maxLength={10}
            placeholder="Confirm account number"
            className={`${errors.confirmAccountNo ? "border-red-500 pr-10" : formData.bankAccountNo && formData.confirmAccountNo && formData.bankAccountNo !== formData.confirmAccountNo ? "border-red-500 pr-10" : "border-gray-300"} ${accountsMatch ? "pr-10" : ""}`}
            aria-invalid={errors.confirmAccountNo ? "true" : "false"}
            aria-describedby={errors.confirmAccountNo ? "confirmAccountNo-error" : undefined}
          />
          <button
            type="button"
            onClick={toggleConfirmAccountNoVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showConfirmAccountNo ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
          {accountsMatch && !errors.confirmAccountNo && (
            <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>
        {errors.confirmAccountNo && (
          <p id="confirmAccountNo-error" className="mt-1 text-xs text-red-500">
            {errors.confirmAccountNo}
          </p>
        )}
        {!errors.confirmAccountNo &&
          formData.bankAccountNo &&
          formData.confirmAccountNo &&
          formData.bankAccountNo !== formData.confirmAccountNo && (
            <p className="mt-1 text-xs text-red-500">Account numbers do not match</p>
          )}
      </div>

      <div className="form-group">
        <Label htmlFor="bankAccountName" className="block text-gray-700 font-medium mb-2">
          Account Name {required && <span className="text-red-500">*</span>}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter the name on your bank account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="relative">
          <Input
            type="text"
            id="bankAccountName"
            name="bankAccountName"
            value={formData.bankAccountName}
            onChange={handleChange}
            required={required}
            maxLength={100}
            placeholder="e.g., John Smith"
            className={`${errors.bankAccountName ? "border-red-500 pr-10" : "border-gray-300"} ${formData.bankAccountName ? "pr-10" : ""}`}
            aria-invalid={errors.bankAccountName ? "true" : "false"}
            aria-describedby={errors.bankAccountName ? "bankAccountName-error" : undefined}
          />
          {formData.bankAccountName && !errors.bankAccountName && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {errors.bankAccountName && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
          )}
        </div>
        {errors.bankAccountName && (
          <p id="bankAccountName-error" className="mt-1 text-xs text-red-500">
            {errors.bankAccountName}
          </p>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-100 flex items-start">
        <svg
          className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <p>
          Your banking information is kept secure and encrypted. It will only be used for tax-related refunds or
          payments.
        </p>
      </div>
    </div>
  )
}
