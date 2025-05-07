"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Eye, EyeOff, CheckCircle, ArrowRight, ArrowLeft, Clock } from "lucide-react"
import * as api from "../services/api"
import Recaptcha from "./ui/recaptcha"
import { getRecaptchaSiteKey } from "../utils/captcha-validation"
import { resetWidgetByContainerId } from "../utils/recaptcha-manager"

// Add mergeRefs utility
const mergeRefs = (...refs: any[]) => (value: any) => {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(value)
    } else if (ref != null) {
      ref.current = value
    }
  })
}

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  agreeToTerms: boolean
  captchaToken?: string
}

const RegisterForm = () => {
  // Refs for all fields that can have errors
  const fieldRefs = {
    email: useRef<HTMLInputElement>(null),
    fullName: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    state: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    zipCode: useRef<HTMLInputElement>(null),
    agreeToTerms: useRef<HTMLInputElement>(null),
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    trigger,
    getValues,
  } = useForm<RegisterFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  })
  const navigate = useNavigate()

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [emailToVerify, setEmailToVerify] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [otpTimer, setOtpTimer] = useState(0)
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState(false)

  // Track which field is currently focused due to error
  const [focusedErrorField, setFocusedErrorField] = useState<string | null>(null)

  // Reset CAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && document.getElementById("register-recaptcha")) {
        try {
          resetWidgetByContainerId("register-recaptcha")
        } catch (error) {
          console.error("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (otpTimer === 0 && emailToVerify) {
      setCanResendOtp(true)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [otpTimer, emailToVerify])

  // Focus the first error field when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Find the first error field in the order of the form
      const order = [
        "email",
        "fullName",
        "phone",
        "password",
        "confirmPassword",
        "address",
        "state",
        "city",
        "zipCode",
        "agreeToTerms",
      ]
      for (const key of order) {
        if (errors[key as keyof RegisterFormData]) {
          setFocusedErrorField(key)
          // Focus the field
          if (fieldRefs[key as keyof typeof fieldRefs]?.current) {
            fieldRefs[key as keyof typeof fieldRefs].current!.focus()
          }
          break
        }
      }
    } else {
      setFocusedErrorField(null)
    }
  }, [errors])

  // When a field is corrected, clear the focused error field if it was that field
  useEffect(() => {
    if (focusedErrorField) {
      // If the error for the focused field is gone, clear the focus
      if (!errors[focusedErrorField as keyof RegisterFormData]) {
        setFocusedErrorField(null)
      }
    }
  }, [errors, focusedErrorField])

  // Fix: keep email value in sync with input (for defaultValue and watch)
  // This ensures that after typing, the latest value is available for validation
  const emailValue = watch("email") || ""

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const onSubmit = async (data: RegisterFormData) => {
    if (!emailVerified) {
      toast.error("Please verify your email before registering")
      setFocusedErrorField("email")
      if (fieldRefs.email.current) fieldRefs.email.current.focus()
      return
    }

    if (!captchaToken && currentStep === 3) {
      setCaptchaError(true)
      toast.error("Please complete the CAPTCHA verification")
      return
    }

    try {
      const { confirmPassword, agreeToTerms, ...userData } = data

      const apiData = {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        captchaToken: captchaToken || undefined,
      }

      const response = await api.register(apiData)
      toast.success("Registration successful! You can now log in.")

      navigate("/login")
    } catch (error) {
      console.error("Registration error:", error)

      if (error instanceof Error && error.message.includes("already registered")) {
        toast.error("This email is already registered. Please use a different email or login.")
        setEmailError("This email is already registered. Please use a different email or login.")
        setFocusedErrorField("email")
        if (fieldRefs.email.current) fieldRefs.email.current.focus()
      } else if (error instanceof Error && error.message.includes("CAPTCHA")) {
        toast.error(error.message)
        setCaptchaError(true)
        // Reset the CAPTCHA widget
        resetWidgetByContainerId("register-recaptcha")
        setCaptchaToken(null)
      } else if (
        typeof error === "object" && error !== null &&
        "response" in error && typeof (error as any).response === "object" && (error as any).response !== null &&
        "data" in (error as any).response && typeof (error as any).response.data === "object" && (error as any).response.data !== null &&
        "error" in (error as any).response.data
      ) {
        toast.error((error as any).response.data.error)

        if ((error as any).response.data.error.includes("CAPTCHA")) {
          setCaptchaError(true)
          resetWidgetByContainerId("register-recaptcha")
          setCaptchaToken(null)
        }
      } else {
        toast.error("Registration failed. Please try again.")
      }
    }
  }

  const handleVerifyEmail = async () => {
    // Use the latest value from the input, not from a possibly stale watch
    const email = (fieldRefs.email.current && fieldRefs.email.current.value) || watch("email") || ""
    // Email format validation
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!email) {
      setError("email", { type: "manual", message: "Email is required" })
      setFocusedErrorField("email")
      if (fieldRefs.email.current) fieldRefs.email.current.focus()
      toast.error("Please enter your email address")
      return
    }
    if (!emailPattern.test(email)) {
      setError("email", { type: "manual", message: "Invalid email address" })
      setFocusedErrorField("email")
      if (fieldRefs.email.current) fieldRefs.email.current.focus()
      toast.error("Please enter a valid email address")
      return
    }
    clearErrors("email")
    setEmailError(null)
    setValue("email", email) // Ensure form state is updated

    try {
      setIsVerifyingEmail(true)
      setEmailToVerify(email)
      await api.sendVerificationOtp(email)
      toast.success("Verification code sent to your email")

      setOtpTimer(300)
      setCanResendOtp(false)
    } catch (error) {
      console.error("Failed to send verification code:", error)
      if (error instanceof Error && error.message.includes("already registered")) {
        const errorMsg = "This email is already registered. Please use a different email or login."
        toast.error(errorMsg)
        setEmailError(errorMsg)
        setError("email", { type: "manual", message: errorMsg })
        setFocusedErrorField("email")
        if (fieldRefs.email.current) fieldRefs.email.current.focus()
      } else {
        toast.error("Failed to send verification code. Please try again.")
      }
    } finally {
      setIsVerifyingEmail(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("")
    if (!otpValue || otpValue.length < 6) {
      toast.error("Please enter the complete verification code")
      return
    }

    try {
      const response = await api.verifyOtp(emailToVerify, otpValue)
      setEmailVerified(true)
      toast.success("Email verified successfully!")
      setCurrentStep(2)
    } catch (error) {
      console.error("Failed to verify code:", error)
      toast.error("Invalid verification code. Please try again.")
    }
  }

  // Validate all fields in the current step, focus first error, and show error reason
  const validateStep = async (step: number) => {
    if (step === 1) {
      // Use the latest value from the input, not from a possibly stale watch
      const email = (fieldRefs.email.current && fieldRefs.email.current.value) || watch("email") || ""
      if (!email) {
        setError("email", { type: "manual", message: "Email is required" })
        setFocusedErrorField("email")
        if (fieldRefs.email.current) fieldRefs.email.current.focus()
        toast.error("Please enter your email address")
        return false
      }
      if (!emailVerified) {
        setError("email", { type: "manual", message: "Please verify your email before proceeding" })
        setFocusedErrorField("email")
        if (fieldRefs.email.current) fieldRefs.email.current.focus()
        toast.error("Please verify your email before proceeding")
        return false
      }
      return true
    }

    if (step === 2) {
      // Validate all fields in step 2
      const valid = await trigger([
        "fullName",
        "phone",
        "password",
        "confirmPassword",
        "address",
        "state",
        "city",
        "zipCode",
        "agreeToTerms",
      ])
      if (!valid) {
        // Focus first error field (handled by useEffect)
        toast.error("Please fill in all required fields correctly")
        return false
      }
      // Also check password match
      const password = getValues("password")
      const confirmPassword = getValues("confirmPassword")
      if (password !== confirmPassword) {
        setError("confirmPassword", { type: "manual", message: "Passwords do not match" })
        setFocusedErrorField("confirmPassword")
        if (fieldRefs.confirmPassword.current) fieldRefs.confirmPassword.current.focus()
        toast.error("Passwords do not match")
        return false
      }
      return true
    }

    if (step === 3) {
      if (!captchaToken) {
        setCaptchaError(true)
        toast.error("Please complete the CAPTCHA verification")
        return false
      }
      return true
    }

    return true
  }

  const goToNextStep = async () => {
    const valid = await validateStep(currentStep)
    if (valid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
    setCaptchaError(false)
  }

  const handleCaptchaError = () => {
    setCaptchaError(true)
    setCaptchaToken(null)
  }

  // Helper for restricting input to numbers only for phone
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, +, -, (, )
    const value = e.target.value.replace(/[^0-9+\-\s()]/g, "")
    e.target.value = value
  }

  // Helper for restricting input to letters and spaces only for full name
  const handleFullNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters (including unicode), spaces, apostrophes, and hyphens
    const value = e.target.value.replace(/[^A-Za-zÀ-ÿ' -]/g, "")
    e.target.value = value
  }

  // Helper for restricting input to letters and spaces only for city and state
  const handleAlphaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-zÀ-ÿ' -]/g, "")
    e.target.value = value
  }

  // Helper for restricting input to numbers and dash for zip code
  const handleZipInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9-]/g, "")
    e.target.value = value
  }

  // --- NEW: Generic onChange handler to clear error for any field ---
  const handleFieldChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors[field]) clearErrors(field)
    // For controlled fields, also update value
    setValue(field, e.target.value)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 text-center">
        <h2 className="text-xl font-bold text-white">Create Your Account</h2>
        <p className="text-blue-100 text-sm">Join our community to access our full range of services</p>
      </div>

      <div className="px-6 py-4">
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <div className={`font-medium ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              1. Email Verification
            </div>
            <div className={`font-medium ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              2. Account Details
            </div>
            <div className={`font-medium ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>3. Complete</div>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Verify Your Email</h3>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={emailValue}
                    onChange={e => {
                      setValue("email", e.target.value)
                      if (errors.email) clearErrors("email")
                      setEmailError(null)
                    }}
                    className={`w-full px-3 py-2 text-sm border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email || emailError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                    disabled={emailVerified}
                    {...(register("email", {
                      // required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                      // Remove onChange from register, handled above
                    }), { ref: undefined })}
                    ref={mergeRefs(fieldRefs.email, register("email").ref)}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={isVerifyingEmail || emailVerified}
                    className={`px-3 py-2 text-xs font-medium text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      emailVerified ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                    } disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap`}
                  >
                    {isVerifyingEmail ? "Sending..." : emailVerified ? "Verified" : "Verify Email"}
                  </button>
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600" id="email-error">
                    {errors.email.message}
                  </p>
                )}
                {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}

                {emailToVerify && !emailVerified && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-blue-800">Verification Code</h4>
                      {otpTimer > 0 && (
                        <div className="flex items-center text-xs text-blue-700">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(otpTimer)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-blue-700 mb-3">Enter the 6-digit verification code sent to your email</p>

                    <div className="flex justify-center space-x-2 mb-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-10 h-10 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !digit && index > 0) {
                              const prevInput = document.getElementById(`otp-${index - 1}`)
                              if (prevInput) {
                                prevInput.focus()
                              }
                            }
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Verify Code
                      </button>

                      {canResendOtp && (
                        <button
                          type="button"
                          onClick={handleVerifyEmail}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Resend verification code
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {emailVerified && (
                  <div className="mt-2 flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Email verified successfully!</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!emailVerified}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Complete Your Profile</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                    {...(register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      pattern: {
                        value: /^[A-Za-zÀ-ÿ' -]+$/,
                        message: "Full name must contain only letters and spaces",
                      },
                      // Remove onChange from register, use generic handler below
                    }), { ref: undefined })}
                    ref={mergeRefs(fieldRefs.fullName, register("fullName").ref)}
                    onInput={handleFullNameInput}
                    onChange={handleFieldChange("fullName")}
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="text"
                    inputMode="tel"
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="(123) 456-7890"
                    {...(register("phone", {
                      pattern: {
                        value: /^[0-9+\-\s()]{10,15}$/,
                        message: "Please enter a valid phone number (numbers only, 10-15 digits)",
                      },
                      // Remove onChange from register, use generic handler below
                    }), { ref: undefined })}
                    ref={mergeRefs(fieldRefs.phone, register("phone").ref)}
                    onInput={handlePhoneInput}
                    onChange={handleFieldChange("phone")}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      {...(register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long",
                        },
                        // Remove onChange from register, use generic handler below
                      }), { ref: undefined })}
                      ref={mergeRefs(fieldRefs.password, register("password").ref)}
                      onChange={e => {
                        handleFieldChange("password")(e)
                        trigger("confirmPassword")
                      }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                      {...(register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) => value === watch("password") || "Passwords do not match",
                        // Remove onChange from register, use generic handler below
                      }), { ref: undefined })}
                      ref={mergeRefs(fieldRefs.confirmPassword, register("confirmPassword").ref)}
                      onChange={handleFieldChange("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123 Main St"
                    {...(register("address", {
                      // Remove onChange from register, use generic handler below
                    }), { ref: undefined })}
                    ref={mergeRefs(fieldRefs.address, register("address").ref)}
                    onChange={handleFieldChange("address")}
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="CA"
                    {...(register("state", {
                      pattern: {
                        value: /^[A-Za-zÀ-ÿ' -]+$/,
                        message: "State must contain only letters",
                      },
                      // Remove onChange from register, use generic handler below
                    }), { ref: undefined })}
                    ref={mergeRefs(fieldRefs.state, register("state").ref)}
                    onInput={handleAlphaInput}
                    onChange={handleFieldChange("state")}
                  />
                  {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Anytown"
                      {...(register("city", {
                        pattern: {
                          value: /^[A-Za-zÀ-ÿ' -]+$/,
                          message: "City must contain only letters",
                        },
                        // Remove onChange from register, use generic handler below
                      }), { ref: undefined })}
                      ref={mergeRefs(fieldRefs.city, register("city").ref)}
                      onInput={handleAlphaInput}
                      onChange={handleFieldChange("city")}
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.zipCode ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="12345"
                      {...(register("zipCode", {
                        pattern: {
                          value: /^\d{5}(-\d{4})?$/,
                          message: "Please enter a valid zip code",
                        },
                        // Remove onChange from register, use generic handler below
                      }), { ref: undefined })}
                      ref={mergeRefs(fieldRefs.zipCode, register("zipCode").ref)}
                      onInput={handleZipInput}
                      onChange={handleFieldChange("zipCode")}
                    />
                    {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode.message}</p>}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      className="h-4 w-4 mr-2 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...(register("agreeToTerms", {
                        required: "Please agree to the terms and conditions",
                        // Remove onChange from register, use generic handler below
                      }), { ref: undefined })}
                      ref={mergeRefs(fieldRefs.agreeToTerms, register("agreeToTerms").ref)}
                      onChange={e => {
                        if (errors.agreeToTerms) clearErrors("agreeToTerms")
                        setValue("agreeToTerms", e.target.checked)
                      }}
                    />
                    <label htmlFor="agreeToTerms" className="text-xs text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms.message}</p>}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Review & Submit</h3>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <p className="text-xs text-gray-700 mb-4">
                  Please review your information before submitting. You'll be able to update your profile later.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{watch("email")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{watch("fullName")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Phone Number</p>
                    <p className="text-sm text-gray-900">{watch("phone") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Address</p>
                    <p className="text-sm text-gray-900">
                      {watch("address") ? (
                        <>
                          {watch("address")}
                          <br />
                          {watch("city")}
                          {watch("city") && watch("state") ? ", " : ""}
                          {watch("state")} {watch("zipCode")}
                        </>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                <p className="text-xs text-gray-500 mb-3">
                  Please complete the security check below to verify you're not a robot.
                </p>
                <div className="flex justify-center w-full">
                  <Recaptcha
                    siteKey={getRecaptchaSiteKey()}
                    onVerify={handleCaptchaVerify}
                    onError={handleCaptchaError}
                    theme="light"
                    className={captchaError ? "border border-red-500 rounded-md p-1" : ""}
                    id="register-recaptcha"
                  />
                </div>
                {captchaError && (
                  <p className="mt-1 text-xs text-red-600 text-center">Please complete the CAPTCHA verification</p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !captchaToken}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
export default RegisterForm
