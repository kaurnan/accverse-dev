"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Save } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { scrollToElement } from "../lib/utils"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { submitIndividualTaxForm, saveIndividualFormProgress } from "../services/tax-form-service"

import FormStep1 from "./tax-form/FormStep1"
import FormStep2 from "./tax-form/FormStep2"
import FormStep3 from "./tax-form/FormStep3"
import FormStep4 from "./tax-form/FormStep4"
import FormStep5 from "./tax-form/FormStep5"
import * as validation from "../utils/form-validation"
import ITREngagementLetterForm from "./tax-form/ITREngagementLetterForm"
import { EngagementLetterData, ITRLetterData } from "@/types/form-types"

interface TaxSolutionsFormProps {
  onSubmit?: (data: any) => void
  formType?: string
}

interface FormDataType {
  [key: string]: string | File | null | { accepted: boolean; dateSigned: string | null } | undefined | boolean
  taxpayerType: "individual" | "soleTrader"
  prefix: string
  firstName: string
  lastName: string
  dateOfBirth: string
  maritalStatus: string
  mobile: string
  email: string
  address: string
  address2: string
  suburb: string
  state: string
  postcode: string
  taxFileNumber: string
  signature: string | File | null
  engagementLetter?: EngagementLetterData | null
  itrEngagementCompleted?: boolean
  itrEngagementLetter?: ITRLetterData | null
}

const TaxSolutionsForm: React.FC<TaxSolutionsFormProps> = ({ formType = "individual" }) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormDataType>({
    taxpayerType: "individual",
    prefix: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    maritalStatus: "",
    mobile: "",
    email: "",
    address: "",
    address2: "",
    suburb: "",
    state: "",
    postcode: "",
    taxFileNumber: "",
    signature: "",
    engagementLetter: null,
    itrEngagementCompleted: false,
    itrEngagementLetter: null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 5
  const formRef = useRef<HTMLDivElement>(null)
  const [taxpayerType, setTaxpayerType] = useState<"individual" | "soleTrader">("individual")
  const [showITREngagement, setShowITREngagement] = useState(false)
  const [hasCompletedITREngagement, setHasCompletedITREngagement] = useState(false)
  const [itrEngagementData, setITREngagementData] = useState<ITRLetterData | null>({
    clientName: "",
    signature: "",
    accepted: false,
    dateSigned: null,
    signDate: new Date().toISOString().split("T")[0],
  })
  const [hasCompletedEngagement, setHasCompletedEngagement] = useState(false)

  useEffect(() => {
    const fromEngagement = searchParams.get("fromEngagement") === "true"
    const engagementCompleted = searchParams.get("engagementCompleted") === "true"
    const returnedStep = searchParams.get("returnedStep")
    
    if (fromEngagement && location.state?.updatedFormData) {
      setFormData(prevData => ({ ...prevData, ...location.state.updatedFormData }))
      
      if (returnedStep) {
        setCurrentStep(parseInt(returnedStep))
      }
      
      if (engagementCompleted) {
        setHasCompletedITREngagement(true)
        toast({
          title: "Engagement Letter Completed",
          description: "Thank you for completing the engagement letter. You can now submit your form.",
          variant: "success",
        })
      }
    }
  }, [location.state, searchParams, toast])

  useEffect(() => {
    if (formType) {
      setFormData((prev) => ({
        ...prev,
        formType: formType,
      }))
    }
  }, [formType])

  useEffect(() => {
    const shouldRestore = searchParams.get("continue") === "true"
    if (shouldRestore) {
      const savedData = localStorage.getItem("taxFormData")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          if (parsedData.itrEngagementAccepted !== undefined) {
            parsedData.itrEngagementCompleted = !!parsedData.itrEngagementAccepted
            delete parsedData.itrEngagementAccepted
          }
          
          setFormData((prevData) => ({
            ...prevData,
            ...parsedData,
            firstName: parsedData.firstName ?? "",
            lastName: parsedData.lastName ?? "",
            prefix: parsedData.prefix ?? "",
            dateOfBirth: parsedData.dateOfBirth ?? "",
            maritalStatus: parsedData.maritalStatus ?? "",
            mobile: parsedData.mobile ?? "",
            email: parsedData.email ?? "",
            address: parsedData.address ?? "",
            address2: parsedData.address2 ?? "",
            suburb: parsedData.suburb ?? "",
            state: parsedData.state ?? "",
            postcode: parsedData.postcode ?? "",
            taxFileNumber: parsedData.taxFileNumber ?? "",
            signature: parsedData.signature ?? "",
          }))

          if (parsedData.taxpayerType === "soleTrader") {
            setTaxpayerType("soleTrader")
            
            if (parsedData.itrEngagementCompleted) {
              setHasCompletedITREngagement(true)
            }
          }

          const savedStep = localStorage.getItem("taxFormStep")
          if (savedStep) {
            setCurrentStep(Number.parseInt(savedStep, 10))
          }

          toast({
            title: "Form data loaded",
            description: "Your previously saved progress has been restored.",
            variant: "default",
          })
        } catch (error) {
          console.error("Error loading saved form data:", error)
        }
      }
    }
  }, [toast, searchParams])

  useEffect(() => {
    if (formData.taxpayerType === "soleTrader" && !hasCompletedITREngagement) {
      setShowITREngagement(true)
    } else {
      setShowITREngagement(false)
    }
  }, [formData.taxpayerType, hasCompletedITREngagement])

  // Fix: Accept optional data for ITREngagementLetterForm onComplete
  const handleITREngagementComplete = (data?: ITRLetterData) => {
    if (!data) return
    setITREngagementData(data)
    setFormData(prev => ({
      ...prev,
      itrEngagementLetter: data,
      itrEngagementCompleted: true, // <-- ADD THIS LINE
    }))
    setHasCompletedITREngagement(true)
    setShowITREngagement(false)
  }

  const handleEngagementComplete = (data: EngagementLetterData) => {
    setFormData(prev => ({
      ...prev,
      engagementLetter: data,
    }))
    setHasCompletedEngagement(true)
  }

  const fieldLimits = {
    firstName: 50,
    lastName: 50,
    mobile: 15,
    email: 100,
    address: 100,
    address2: 100,
    suburb: 50,
    postcode: 4,
    taxFileNumber: 9,
    bankBsb: 7,
    bankAccountNo: 10,
    bankAccountName: 100,
    bankName: 50,
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    let processedValue = value

    if (
      type === "tel" ||
      name === "postcode" ||
      name === "taxFileNumber" ||
      name === "bankAccountNo" ||
      name === "bankBsb"
    ) {
      if (name === "bankBsb") {
        processedValue = value.replace(/[^\d-]/g, "")
        if (processedValue.length > 3 && !processedValue.includes("-")) {
          processedValue = `${processedValue.substring(0, 3)}-${processedValue.substring(3)}`
        }
        if (processedValue.length > 7) {
          processedValue = processedValue.substring(0, 7)
        }
      } else {
        processedValue = value.replace(/\D/g, "")
      }
    }

    if (
      fieldLimits[name as keyof typeof fieldLimits] &&
      processedValue.length > fieldLimits[name as keyof typeof fieldLimits]
    ) {
      processedValue = processedValue.substring(0, fieldLimits[name as keyof typeof fieldLimits])
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))

    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }

    // Only set error if there is an error, otherwise remove it
    const fieldError = validation.validateField(name, processedValue)
    setErrors((prev) => {
      const newErrors = { ...prev }
      if (fieldError) {
        newErrors[name] = fieldError
      } else {
        delete newErrors[name]
      }
      return newErrors
    })
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }

    // Remove error for this field if it exists
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })

    if (name === "privateHealth" && value === "no") {
      setFormData((prev) => ({ ...prev, privateHealthFile: null }))
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.privateHealthFile
        return newErrors
      })
    }

    if (name === "taxpayerType") {
      setTaxpayerType(value as "individual" | "soleTrader")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null

    if (file && file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "File size exceeds 5MB limit",
      }))
      return
    }

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Only JPG, PNG and PDF files are allowed",
        }))
        return
      }
    }

    setFormData((prev) => ({ ...prev, [fieldName]: file }))

    if (!touched[fieldName]) {
      setTouched((prev) => ({ ...prev, [fieldName]: true }))
    }

    // Remove error for this field if it exists
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const handleFileDelete = (fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: null }))

    if (fieldName === "privateHealthFile" && formData.privateHealth === "yes") {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Please upload your private health insurance statement",
      }))
    } else if (fieldName === "idDocument") {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "ID Document is required",
      }))
    } else if (fieldName === "supportingDocs" && formData.supportingDocsRequired === "yes") {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Supporting documents are required",
      }))
    } else {
      // Remove error for this field if it exists
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.taxpayerType) newErrors.taxpayerType = "Please select a taxpayer type"
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.mobile) newErrors.mobile = "Mobile number is required"
      else if (!validation.validatePhone(formData.mobile)) newErrors.mobile = "Please enter a valid mobile number"
      if (!formData.email) newErrors.email = "Email is required"
      else if (!validation.validateEmail(formData.email)) newErrors.email = "Please enter a valid email address"
      if (!formData.address) newErrors.address = "Address is required"
      if (!formData.suburb) newErrors.suburb = "Suburb is required"
      if (!formData.state) newErrors.state = "State is required"
      if (!formData.postcode) newErrors.postcode = "Postcode is required"
      else if (!validation.validatePostcode(formData.postcode))
        newErrors.postcode = "Please enter a valid 4-digit postcode"
      if (!formData.taxFileNumber) newErrors.taxFileNumber = "Tax File Number is required"
      else if (!validation.validateTFN(formData.taxFileNumber))
        newErrors.taxFileNumber = "Please enter a valid TFN (8-9 digits)"
      if (!formData.idDocument) newErrors.idDocument = "ID Document is required"

      // Validate each banking field separately and all are required
      if (!formData.bankBsb) {
        newErrors.bankBsb = "BSB is required";
      }
      if (!formData.bankAccountNo) {
        newErrors.bankAccountNo = "Account number is required";
      } else if (!validation.validateAccountNumber(formData.bankAccountNo as string)) {
        newErrors.bankAccountNo = "Please enter a valid account number (6-10 digits)";
      }
      if (!formData.confirmAccountNo) {
        newErrors.confirmAccountNo = "Please confirm your account number";
      } else if (formData.bankAccountNo && formData.confirmAccountNo !== formData.bankAccountNo) {
        newErrors.confirmAccountNo = "Account numbers do not match";
      }
      if (!formData.bankAccountName) {
        newErrors.bankAccountName = "Account name is required";
      }
      if (!formData.bankName) {
        newErrors.bankName = "Bank name is required";
      }
      
      delete newErrors.engagementLetter;
    } else if (step === 2) {
      if (!formData.citizenStatus) newErrors.citizenStatus = "Please select your citizen status"
      if (!formData.spouse) newErrors.spouse = "Please indicate if you have a spouse"
      if (!formData.dependents) newErrors.dependents = "Please indicate if you have dependents"
      if (!formData.medicare) newErrors.medicare = "Please indicate if you have Medicare"
      if (!formData.privateHealth) newErrors.privateHealth = "Please indicate if you have private health insurance"
      if (formData.privateHealth === "yes" && !formData.privateHealthFile) {
        newErrors.privateHealthFile = "Please upload your private health insurance statement"
      }
      if (!formData.hecsDebt) newErrors.hecsDebt = "Please indicate if you have HECS/HELP debt"
    } else if (step === 3) {
      if (!formData.salary) newErrors.salary = "Please answer this question"
      if (!formData.interest) newErrors.interest = "Please answer this question"
      if (!formData.dividends) newErrors.dividends = "Please answer this question"
      if (formData.dividends === 'yes' && !formData.dividendStatements) newErrors.dividendStatements = "Please upload your dividend statement"
      if (!formData.partnership) newErrors.partnership = "Please answer this question"
      if (!formData.personalServiceIncome) newErrors.personalServiceIncome = "Please answer this question"
      if (formData.personalServiceIncome === 'yesWithVehicle' && !formData.personalServiceLogbook) newErrors.personalServiceLogbook = "Please upload your logbook and declaration"
      if (!formData.soleTraderIncome) newErrors.soleTraderIncome = "Please answer this question"
      if (formData.soleTraderIncome === 'yesWithVehicle' && !formData.soleTraderLogbook) newErrors.soleTraderLogbook = "Please upload your logbook and declaration"
      if (!formData.soldInvestments) newErrors.soldInvestments = "Please answer this question"
      if (formData.soldInvestments === 'yes' && !formData.soldInvestmentsFile) newErrors.soldInvestmentsFile = "Please upload your buy & sell orders history"
      if (!formData.soldRental) newErrors.soldRental = "Please answer this question"
      if (!formData.foreignIncome) newErrors.foreignIncome = "Please answer this question"
      if (!formData.rentalIncome) newErrors.rentalIncome = "Please answer this question"
      if (formData.rentalIncome === 'yes' && !formData.rentalIncomeFile) newErrors.rentalIncomeFile = "Please upload your rental property statements"
      if (!formData.sharingEconomyIncome) newErrors.sharingEconomyIncome = "Please answer this question"
      if (formData.sharingEconomyIncome === 'yes' && !formData.sharingEconomyIncomeFile) newErrors.sharingEconomyIncomeFile = "Please upload your sharing economy income statements"
      if (!formData.pensionIncome) newErrors.pensionIncome = "Please answer this question"
      if (!formData.employeeShareScheme) newErrors.employeeShareScheme = "Please answer this question"
      if (!formData.otherIncome) newErrors.otherIncome = "Please answer this question"
    } else if (step === 4) {
      if (!formData.carExpense) newErrors.carExpense = "Please answer this question"
      if (!formData.uniformExpense) newErrors.uniformExpense = "Please answer this question"
      if (!formData.travelExpense) newErrors.travelExpense = "Please answer this question"
      if (!formData.educationExpense) newErrors.educationExpense = "Please answer this question"
      if (!formData.phoneExpense) newErrors.phoneExpense = "Please answer this question"
      if (!formData.toolsExpense) newErrors.toolsExpense = "Please answer this question"
      if (!formData.otherWorkExpenses) newErrors.otherWorkExpenses = "Please answer this question"
      if (!formData.incomeProtectionInsurance) newErrors.incomeProtectionInsurance = "Please answer this question"
      if (!formData.donations) newErrors.donations = "Please answer this question"
      if (!formData.taxAgentFees) newErrors.taxAgentFees = "Please answer this question"
      if (!formData.superContribution) newErrors.superContribution = "Please answer this question"
      if (!formData.interestExpense) newErrors.interestExpense = "Please answer this question"
      if (!formData.workFromHome) newErrors.workFromHome = "Please answer this question"
    } else if (step === 5) {
      if (!formData.declarationAccepted || formData.declarationAccepted !== "yes") {
        newErrors.declarationAccepted = "You must accept the declaration to proceed"
      }
      if (!formData.signature) newErrors.signature = "Please sign the form"

      if (formData.supportingDocsRequired === "yes" && !formData.supportingDocs) {
        newErrors.supportingDocs = "Please upload your supporting documents"
      }
      
      if (
        formData.taxpayerType === "soleTrader" && 
        (!formData.itrEngagementCompleted || !formData.engagementLetter || !formData.engagementLetter.accepted)
      ) {
        newErrors.engagementLetter = "You must complete the engagement letter before submitting"
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0]

      let element = document.getElementById(firstErrorField)

      if (!element) {
        const labels = document.querySelectorAll(`label[for="${firstErrorField}"]`)
        if (labels.length > 0) {
          element = labels[0] as HTMLElement
        }
      }

      if (!element) {
        element = document.querySelector(`[data-field="${firstErrorField}"]`) as HTMLElement
      }

      if (element) {
        element.classList.add("error-highlight")

        setTimeout(() => {
          element.classList.remove("error-highlight")
        }, 2000)

        scrollToElement(element)
      } else {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      return false
    }

    return true
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)

        localStorage.setItem("taxFormStep", (currentStep + 1).toString())

        saveFormData()
      } else {
        toast({
          title: "Please correct the errors",
          description: "There are validation errors that need to be fixed before proceeding.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)

      localStorage.setItem("taxFormStep", (currentStep - 1).toString())
    }
  }

  const saveFormData = () => {
    const dataToSave = { ...formData }
    Object.keys(dataToSave).forEach((key) => {
      if (dataToSave[key] instanceof File) {
        dataToSave[key] = "[FILE_UPLOADED]"
      }
    })

    localStorage.setItem("taxFormData", JSON.stringify(dataToSave))
  }

  const handleSaveProgress = async () => {
    try {
      localStorage.setItem("taxFormStep", currentStep.toString())
      saveFormData()

      const result = await saveIndividualFormProgress({
        ...formData,
        formType: "individual",
        itrEngagementLetter: formData.itrEngagementLetter || itrEngagementData,
      })

      if (result.success) {
        toast({
          title: "Progress saved",
          description: "You can return to complete the form later.",
          variant: "success",
        })
      } else {
        throw new Error(result.error || "Failed to save progress")
      }
    } catch (error) {
      console.error("Error saving form progress:", error)
      toast({
        title: "Failed to save progress",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true)

      try {
        const taxFormData = new FormData()

        // Always append formType first
        taxFormData.append("formType", formType || "individual")

        // Add other form data
        for (const key in formData) {
          if (
            key !== "formType" &&
            key !== "engagementLetter" &&
            key !== "itrEngagementLetter"
          ) {
            if (formData[key] !== null && formData[key] !== undefined) {
              if (formData[key] instanceof File) {
                taxFormData.append(key, formData[key] as File)
              } else if (typeof formData[key] === 'boolean') {
                taxFormData.append(key, formData[key] ? 'true' : 'false')
              } else if (typeof formData[key] === 'object' && formData[key] !== null) {
                taxFormData.append(key, JSON.stringify(formData[key]))
              } else {
                taxFormData.append(key, String(formData[key]))
              }
            }
          }
        }

        if (formData.engagementLetter) {
          taxFormData.append("engagementLetter", JSON.stringify(formData.engagementLetter))
        }
        if (formData.itrEngagementLetter || itrEngagementData) {
          taxFormData.append(
            "itrEngagementLetter",
            JSON.stringify(formData.itrEngagementLetter || itrEngagementData)
          )
        }

        const result = await submitIndividualTaxForm(taxFormData)

        if (result.success) {
          localStorage.removeItem("taxFormData")
          localStorage.removeItem("taxFormStep")

          if (formData.taxpayerType === "soleTrader") {
            navigate("/payment/sole-trader", { state: { formData } })
          } else {
            navigate("/payment/individual", { state: { formData } })
          }

          toast({
            title: "Form submitted successfully",
            description: "Please complete the payment process to finalize your submission.",
            variant: "success",
          })
        } else {
          throw new Error(result.error || "Form submission failed")
        }
      } catch (error: any) {
        console.error("Error submitting form:", error)
        toast({
          title: "Form submission failed",
          description: error instanceof Error ? error.message : "There was an error submitting your form. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast({
        title: "Please correct the errors",
        description: "There are validation errors that need to be fixed before submitting.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto" ref={formRef}>
      {showITREngagement ? (
        <ITREngagementLetterForm
          onComplete={handleITREngagementComplete}
          formData={formData}
          itrEngagementLetter={formData.itrEngagementLetter || itrEngagementData}
          setITREngagementLetter={setITREngagementData}
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step < currentStep
                      ? "bg-green-500 text-white border-green-500"
                      : step === currentStep
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-400 border-gray-300"
                  } transition-colors z-10`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : <span>{step}</span>}
                  {step !== totalSteps && (
                    <div
                      className={`absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2 ${
                        step < currentStep ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between px-1 text-sm">
              <div className="text-center w-20 -ml-5">Personal Info</div>
              <div className="text-center w-20 -ml-5">Tax Residency</div>
              <div className="text-center w-20 -ml-5">Income</div>
              <div className="text-center w-20 -ml-5">Expenses</div>
              <div className="text-center w-20 -ml-5">Declaration</div>
            </div>
          </div>

          <div className="mb-8">
            {currentStep === 1 && (
              <FormStep1
                formData={formData}
                handleChange={handleChange}
                handleRadioChange={handleRadioChange}
                handleFileChange={handleFileChange}
                handleFileDelete={handleFileDelete}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <FormStep2
                formData={formData}
                handleRadioChange={handleRadioChange}
                handleFileChange={handleFileChange}
                handleFileDelete={handleFileDelete}
                errors={errors}
              />
            )}

            {currentStep === 3 && <FormStep3 formData={formData} handleRadioChange={handleRadioChange} handleFileChange={handleFileChange} handleFileDelete={handleFileDelete} errors={errors} />}

            {currentStep === 4 && <FormStep4 formData={formData} handleRadioChange={handleRadioChange} errors={errors} />}

            {currentStep === 5 && (
              <FormStep5
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleFileDelete={handleFileDelete}
                handleRadioChange={handleRadioChange}
                errors={errors}
                currentStep={currentStep}
                engagementLetter={formData.engagementLetter ?? null}
                setEngagementLetter={handleEngagementComplete}
              />
            )}
          </div>

          <div className="flex justify-between pb-10">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>

            <div className="flex space-x-3">
              <Button type="button" onClick={handleSaveProgress} variant="secondary" className="flex items-center">
                <Save className="w-4 h-4 mr-1" /> Save & Continue Later
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext} className="flex items-center bg-blue-600 hover:bg-blue-700">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit <CheckCircle className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-red-700 font-medium">Please correct the following errors:</h3>
              </div>
              <ul className="list-disc pl-10 text-red-600">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field} className="text-sm">
                    <button
                      type="button"
                      className="text-left underline"
                      onClick={() => {
                        const element = document.getElementById(field)
                        if (element) {
                          element.classList.add("error-highlight")

                          setTimeout(() => {
                            element.classList.remove("error-highlight")
                          }, 2000)

                          scrollToElement(element)
                        } else {
                          const label = document.querySelector(`label[for="${field}"]`) as HTMLElement
                          if (label) {
                            label.classList.add("error-highlight")
                            setTimeout(() => {
                              label.classList.remove("error-highlight")
                            }, 2000)
                            scrollToElement(label)
                          } else {
                            const container = document.querySelector(`[data-field="${field}"]`) as HTMLElement
                            if (container) {
                              container.classList.add("error-highlight")
                              setTimeout(() => {
                                container.classList.remove("error-highlight")
                              }, 2000)
                              scrollToElement(container)
                            }
                          }
                        }
                      }}
                    >
                      {message}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TaxSolutionsForm