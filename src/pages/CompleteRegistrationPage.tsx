"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { completeGoogleRegistration } from "../services/api"
import { useAuth } from "../components/AuthContext"
import Recaptcha from "../components/ui/recaptcha"
import { getRecaptchaSiteKey } from "../utils/captcha-validation"
import { resetWidgetByContainerId } from "../utils/recaptcha-manager"

interface GoogleAuthData {
  firebase_uid: string
  firebase_token: string
  email: string | null
  name: string | null
}

interface FormErrors {
  phone?: string
  city?: string
  state?: string
  zipCode?: string
  address?: string
}

const onlyNumbers = (value: string) => /^[0-9]*$/.test(value)
const onlyLetters = (value: string) => /^[a-zA-Z\s]*$/.test(value)
const onlyZip = (value: string) => /^[0-9\-]*$/.test(value) // allow dash for ZIP+4

const CompleteRegistrationPage = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [googleData, setGoogleData] = useState<GoogleAuthData | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    // Check if we have Google auth data in session storage
    const storedData = sessionStorage.getItem("googleAuthData")
    if (!storedData) {
      toast.error("No Google sign-in data found. Please try signing in again.")
      navigate("/login")
      return
    }

    try {
      const parsedData = JSON.parse(storedData)
      setGoogleData(parsedData)
    } catch (error) {
      console.error("Error parsing Google auth data:", error)
      toast.error("Invalid Google sign-in data. Please try again.")
      navigate("/login")
    }
  }, [navigate])

  // Reset CAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && document.getElementById("complete-registration-recaptcha")) {
        try {
          resetWidgetByContainerId("complete-registration-recaptcha")
        } catch (error) {
          console.error("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "phone":
        if (!onlyNumbers(value)) return "Phone number must contain numbers only"
        if (value.length < 7) return "Phone number is too short"
        break
      case "city":
        if (!onlyLetters(value)) return "City must contain letters only"
        break
      case "state":
        if (!onlyLetters(value)) return "State must contain letters only"
        break
      case "zipCode":
        if (!onlyZip(value)) return "ZIP code must be numbers only"
        if (value.length < 5) return "ZIP code is too short"
        break
      case "address":
        if (value.trim().length === 0) return "Address is required"
        break
      default:
        break
    }
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Restrict input at the field level for phone, city, state, zipCode
    let newValue = value
    let error: string | undefined

    if (name === "phone") {
      // Only allow numbers
      newValue = value.replace(/[^0-9]/g, "")
      error = validateField(name, newValue)
    } else if (name === "city" || name === "state") {
      // Only allow letters and spaces
      newValue = value.replace(/[^a-zA-Z\s]/g, "")
      error = validateField(name, newValue)
    } else if (name === "zipCode") {
      // Only allow numbers and dash
      newValue = value.replace(/[^0-9\-]/g, "")
      error = validateField(name, newValue)
    } else if (name === "address") {
      error = validateField(name, newValue)
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }))

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
    setCaptchaError(false)
  }

  const handleCaptchaError = () => {
    setCaptchaError(true)
    setCaptchaToken(null)
  }

  const validateAllFields = () => {
    const errors: FormErrors = {}
    errors.phone = validateField("phone", formData.phone)
    errors.city = validateField("city", formData.city)
    errors.state = validateField("state", formData.state)
    errors.zipCode = validateField("zipCode", formData.zipCode)
    errors.address = validateField("address", formData.address)
    setFormErrors(errors)
    // Return true if no errors
    return Object.values(errors).every((v) => !v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!googleData) {
      toast.error("Google sign-in data is missing. Please try again.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (!captchaToken) {
      setCaptchaError(true)
      toast.error("Please complete the CAPTCHA verification")
      return
    }

    if (!validateAllFields()) {
      toast.error("Please correct the errors in the form")
      return
    }

    setLoading(true)

    try {
      // Submit complete registration data to backend
      const response = await completeGoogleRegistration({
        firebase_uid: googleData.firebase_uid,
        firebase_token: googleData.firebase_token,
        email: googleData.email || "",
        name: googleData.name || "",
        // password: formData.password,
        captchaToken,
        ...formData,
      })

      // Store token and user data
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      // Update auth context
      login(response.user, response.token)

      // Clear the temporary session storage
      sessionStorage.removeItem("googleAuthData")

      toast.success("Registration completed successfully!")
      navigate("/")
    } catch (error) {
      console.error("Registration completion error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to complete registration"

      if (errorMessage.includes("CAPTCHA")) {
        toast.error("CAPTCHA verification failed. Please try again.")
        setCaptchaError(true)
        // Reset the CAPTCHA widget
        resetWidgetByContainerId("complete-registration-recaptcha")
        setCaptchaToken(null)
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Complete Your Registration</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide additional information to complete your account setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {googleData && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-700 text-sm">
                <span className="font-medium">Email:</span> {googleData.email}
              </p>
              <p className="text-blue-700 text-sm">
                <span className="font-medium">Name:</span> {googleData.name}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.phone ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={15}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.address ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${formErrors.city ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <div className="mt-1">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${formErrors.state ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.state}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <div className="mt-1">
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.zipCode ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  inputMode="numeric"
                  pattern="[0-9\-]*"
                  maxLength={10}
                />
                {formErrors.zipCode && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.zipCode}</p>
                )}
              </div>
            </div>

            {/* Google reCAPTCHA */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Verification</label>
              <div className="flex justify-center w-full">
                <Recaptcha
                  siteKey={getRecaptchaSiteKey()}
                  onVerify={handleCaptchaVerify}
                  onError={handleCaptchaError}
                  theme="light"
                  className={captchaError ? "border border-red-500 rounded-md p-1" : ""}
                  id="complete-registration-recaptcha"
                />
              </div>
              {captchaError && (
                <p className="mt-1 text-xs text-red-600 text-center">Please complete the security verification</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteRegistrationPage
