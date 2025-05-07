"use client"

import { Textarea } from "../ui/textarea"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"
import { taxSolutionsService } from "../../services/api"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { validateForm, scrollToFirstError } from "../../utils/form-validation"
import { useNavigate } from "react-router-dom"
import { FormErrorSummary } from "../ui/form-error-summary"
import { FileUpload } from "../ui/file-upload"

// Helper functions for input validation
const allowOnlyNumbers = (value: string) => value.replace(/[^0-9]/g, "")
const allowOnlyAlphabets = (value: string) => value.replace(/[^a-zA-Z\s]/g, "")
const allowAlphaNumeric = (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, "")

interface CompanyRegistrationFormProps {
  formType: string
}

const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({ formType }) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    // Company Details
    preferredCompanyName: "",
    identicalToBN: false,
    businessNameABN: "",
    businessNameIdentifier: "",
    reservedName: false,
    trusteeType: "none",
    stateOfRegistration: "NSW",
    registeredOfficeAddress: "",
    registeredOfficeOccupier: "",
    occupierConsent: false,
    principalPlaceOfBusiness: "",
    businessActivity: "",

    // Officeholder Details
    fullName: "",
    residentialAddress: "",
    dateOfBirth: "",
    placeOfBirth: "",
    officeHeld: "Director",

    // Shareholder Details
    shareholderName: "",
    shareholderACN: "",
    shareholderAddress: "",
    numberOfShares: "100",
    classOfShares: "Ordinary",
    pricePerShare: "1.00",
    beneficiallyHeld: "yes",

    // Identification Documents
    idDocuments: null as File | null,

    // ABN Registration
    isResident: "yes",
    abnReason: "new-business",
    abnReasonOther: "",
    firstBusinessInAus: "yes",
    registrationDate: new Date().toISOString().split("T")[0],
    lessThanThreeMonths: "no",
    ceaseActivityDate: "",
    multipleLocations: "no",
    additionalLocations: [],
    governmentOwned: "no",
    mainIndustry: "",
    mainActivity: "",
    agriculturalProperty: "no",
  })
  
  const [loading, setLoading] = useState(false)
  const [formId, setFormId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showErrorSummary, setShowErrorSummary] = useState(false)
  const navigate = useNavigate()
  
  // Field character limits
  const fieldLimits = {
    preferredCompanyName: 150,
    businessNameABN: 11,
    businessNameIdentifier: 20,
    registeredOfficeAddress: 200,
    registeredOfficeOccupier: 100,
    principalPlaceOfBusiness: 200,
    businessActivity: 300,
    fullName: 100,
    residentialAddress: 200,
    placeOfBirth: 100,
    shareholderName: 100,
    shareholderACN: 9,
    shareholderAddress: 200,
    numberOfShares: 10,
    classOfShares: 30,
    pricePerShare: 10,
    abnReasonOther: 200,
    mainIndustry: 100,
    mainActivity: 200,
  }
  
  // Fields that require numbers only
  const numbersOnlyFields = [
    'businessNameABN',
    'shareholderACN',
    'numberOfShares',
    'pricePerShare'
  ]
  
  // Fields that require alphabets only
  const alphabetsOnlyFields = [
    'preferredCompanyName',
    'fullName',
    'shareholderName',
    'registeredOfficeOccupier',
    'placeOfBirth',
    'classOfShares'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    // Handle checkbox separately
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
      markAsTouched(name)
      return
    }
    let updatedValue = value
    // Numbers-only fields
    if (numbersOnlyFields.includes(name)) {
      updatedValue = allowOnlyNumbers(updatedValue)
    }
    // Alphabets-only fields
    if (alphabetsOnlyFields.includes(name)) {
      updatedValue = allowOnlyAlphabets(updatedValue)
    }
    // Apply character limits
    if (fieldLimits[name as keyof typeof fieldLimits]) {
      updatedValue = updatedValue.slice(0, fieldLimits[name as keyof typeof fieldLimits])
    }
    setFormData((prev) => ({ ...prev, [name]: updatedValue }))
    markAsTouched(name)
    // Only clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    markAsTouched(name)
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        idDocuments: e.target.files?.[0] || null,
      }))
      markAsTouched(e.target.name)
    }
  }
  
  const markAsTouched = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm(formData)
    
    setErrors(validationErrors)
    setShowErrorSummary(true)

    // Don't save if there are errors
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors)
      toast({
        title: "Form has errors",
        description: "Please correct the errors before saving.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Remove the file from JSON data
      const { idDocuments, ...jsonData } = formData

      const payload = {
        formType: "company-registration",
        formData: JSON.stringify(jsonData),
        status: "progress",
      }

      const response = await taxSolutionsService.saveProgress(payload)
      setFormId(response.formId)

      toast({
        title: "Progress Saved",
        description: "You can continue later using the form ID: " + response.formId,
      })
    } catch (error) {
      console.error("Error saving form:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your progress",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the handleSubmit function to validate and scroll to errors
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit called');
    e.preventDefault();
    console.log('Form submission started');

    // Add formType to formData for validation
    const formDataWithType = {
      ...formData,
      formType: "company-registration"
    }

    // Validate form - company registration form doesn't have banking fields
    const validationErrors = validateForm(formDataWithType)
    console.log('Validation errors:', validationErrors);

    // Add custom validation for occupier consent
    if (formData.registeredOfficeOccupier && !formData.occupierConsent) {
      validationErrors.occupierConsent = "You must confirm occupier consent";
      setErrors(validationErrors);
      setShowErrorSummary(true);
      scrollToFirstError(validationErrors);
      return;
    }
    
    setErrors(validationErrors)
    setShowErrorSummary(true)

    // If there are errors, show toast and scroll to first error
    if (Object.keys(validationErrors).length > 0) {
      console.log('Form has validation errors, stopping submission');
      scrollToFirstError(validationErrors)
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    console.log('Starting form submission process');

    try {
      // Create FormData object for submission
      const formDataObj = new FormData()

      // Add form type
      formDataObj.append("formType", "company-registration")

      // Extract file from form data to handle separately
      const { idDocuments, ...jsonData } = formData

      // Add JSON data
      formDataObj.append("formData", JSON.stringify(jsonData))

      // Append file if available
      if (formData.idDocuments) {
        formDataObj.append("idDocuments", formData.idDocuments)
      }

      console.log("Submitting company registration form", jsonData)
      const response = await taxSolutionsService.submitTaxForm(formDataObj)
      console.log("Form submission response:", response)

      toast({
        title: "Form Submitted",
        description: "Your company registration form has been submitted successfully",
      })

      console.log("Navigating to payment page")
      // Redirect to payment page with form data
      navigate('/company-registration-payment', {
        state: { formData: jsonData }
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your form",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Determine if a field has an error and should be highlighted
  const hasError = (fieldName: string) => Boolean(touched[fieldName] && errors[fieldName])

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <FormErrorSummary 
        errors={errors} 
        visible={showErrorSummary}
        excludeFields={['bankBsb', 'bankAccountNo', 'bankAccountName', 'bankName', 'confirmAccountNo']}
      />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Company Registration Checklist</h2>
          <p className="text-gray-600 mb-4">
            Outlined below is a checklist of the information needed to complete a Company Registration application.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold border-b pb-2">COMPANY DETAILS</h3>

          <div className="mb-6">
            <Label htmlFor="preferredCompanyName">Preferred company name<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="preferredCompanyName"
              name="preferredCompanyName"
              required
              value={formData.preferredCompanyName}
              onChange={handleChange}
              className={`peer block border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('preferredCompanyName') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('preferredCompanyName')}
              aria-describedby={hasError('preferredCompanyName') ? 'error-preferredCompanyName' : undefined}
              onBlur={() => markAsTouched('preferredCompanyName')}
              autoComplete="off"
            />
            {hasError('preferredCompanyName') && (
              <p id="error-preferredCompanyName" className="mt-1 text-xs text-red-500">{errors.preferredCompanyName}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-2">
            <Checkbox
              id="identicalToBN"
              checked={formData.identicalToBN}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, identicalToBN: checked as boolean }))
                markAsTouched('identicalToBN')
              }}
            />
            <Label htmlFor="identicalToBN">The company name is identical to a registered business name</Label>
          </div>

          {formData.identicalToBN && (
            <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-6">
                <Label htmlFor="businessNameABN" className="block mb-1 font-medium">ABN of the business name holder</Label>
                <Input
                  id="businessNameABN"
                  name="businessNameABN"
                  value={formData.businessNameABN}
                  onChange={handleChange}
                  maxLength={11}
                  placeholder="e.g. 12345678901"
                  onBlur={() => markAsTouched('businessNameABN')}
                  className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('businessNameABN') ? 'border-red-500' : ''}`}
                />
                {hasError('businessNameABN') && (
                  <p id="error-businessNameABN" className="mt-1 text-xs text-red-500">{errors.businessNameABN}</p>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="businessNameIdentifier" className="block mb-1 font-medium">Business name identifier</Label>
                <Input
                  id="businessNameIdentifier"
                  name="businessNameIdentifier"
                  value={formData.businessNameIdentifier}
                  onChange={handleChange}
                  placeholder="If registered prior to 28/05/2012"
                  onBlur={() => markAsTouched('businessNameIdentifier')}
                  className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('businessNameIdentifier') ? 'border-red-500' : ''}`}
                />
                {hasError('businessNameIdentifier') && (
                  <p id="error-businessNameIdentifier" className="mt-1 text-xs text-red-500">{errors.businessNameIdentifier}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-2">
            <Checkbox
              id="reservedName"
              checked={formData.reservedName}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, reservedName: checked as boolean }))
                markAsTouched('reservedName')
              }}
            />
            <Label htmlFor="reservedName">The company name has been reserved</Label>
          </div>

          {formData.reservedName && (
            <div className="pl-6">
              <p className="text-sm text-gray-600">
                You will need to provide a signed name reservation withdrawal letter signed by the applicant of the
                initial reservation form.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-2">
            <div>
              <Label htmlFor="trusteeType">Will the company act solely as the Trustee of a Self-Managed Super Fund, or as a Home Unit company?</Label>
              <select
                name="trusteeType"
                id="trusteeType"
                value={formData.trusteeType}
                onChange={handleChange}
                className={`w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('trusteeType') ? 'border-red-500' : ''}`}
                onBlur={() => markAsTouched('trusteeType')}
              >
                <option value="none">No</option>
                <option value="smsf">Yes - Trustee of SMSF</option>
                <option value="home-unit">Yes - Home Unit company</option>
              </select>
              {hasError('trusteeType') && (
                <p id="error-trusteeType" className="mt-1 text-xs text-red-500">{errors.trusteeType}</p>
              )}
            </div>
            <div>
              <Label htmlFor="stateOfRegistration">State of registration</Label>
              <select
                name="stateOfRegistration"
                id="stateOfRegistration"
                value={formData.stateOfRegistration}
                onChange={handleChange}
                className={`w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('stateOfRegistration') ? 'border-red-500' : ''}`}
                onBlur={() => markAsTouched('stateOfRegistration')}
              >
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
              {hasError('stateOfRegistration') && (
                <p id="error-stateOfRegistration" className="mt-1 text-xs text-red-500">{errors.stateOfRegistration}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="registeredOfficeAddress">Registered office address (must be located in Australia; PO boxes are not acceptable)<span className="text-red-500 ml-1">*</span></Label>
            <Textarea
              id="registeredOfficeAddress"
              name="registeredOfficeAddress"
              required
              rows={2}
              value={formData.registeredOfficeAddress}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('registeredOfficeAddress') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('registeredOfficeAddress')}
              aria-describedby={hasError('registeredOfficeAddress') ? 'error-registeredOfficeAddress' : undefined}
              onBlur={() => markAsTouched('registeredOfficeAddress')}
              maxLength={fieldLimits.registeredOfficeAddress}
            />
            {hasError('registeredOfficeAddress') && (
              <p id="error-registeredOfficeAddress" className="mt-1 text-xs text-red-500">{errors.registeredOfficeAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-2">
            <div className="mb-6">
              <Label htmlFor="registeredOfficeOccupier">The occupier of the registered office (if not the company)</Label>
              <Input
                id="registeredOfficeOccupier"
                name="registeredOfficeOccupier"
                value={formData.registeredOfficeOccupier}
                onChange={handleChange}
                onBlur={() => markAsTouched('registeredOfficeOccupier')}
                className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('registeredOfficeOccupier') ? 'border-red-500' : ''}`}
                autoComplete="off"
              />
              {hasError('registeredOfficeOccupier') && (
                <p id="error-registeredOfficeOccupier" className="mt-1 text-xs text-red-500">{errors.registeredOfficeOccupier}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="occupierConsent"
              checked={formData.occupierConsent}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, occupierConsent: checked as boolean }))
                markAsTouched('occupierConsent')
              }}
              required={!!formData.registeredOfficeOccupier}
            />
            <Label htmlFor="occupierConsent">I confirm that the occupier has provided consent in writing<span className="text-red-500 ml-1">*</span></Label>
          </div>

          <div>
            <Label htmlFor="principalPlaceOfBusiness">Principal place of business (where the primary business activities will take place; PO boxes are not
              acceptable)<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="principalPlaceOfBusiness"
              name="principalPlaceOfBusiness"
              required
              value={formData.principalPlaceOfBusiness}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('principalPlaceOfBusiness') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('principalPlaceOfBusiness')}
              aria-describedby={hasError('principalPlaceOfBusiness') ? 'error-principalPlaceOfBusiness' : undefined}
              onBlur={() => markAsTouched('principalPlaceOfBusiness')}
            />
            {hasError('principalPlaceOfBusiness') && (
              <p id="error-principalPlaceOfBusiness" className="mt-1 text-xs text-red-500">{errors.principalPlaceOfBusiness}</p>
            )}
          </div>

          <div>
            <Label htmlFor="businessActivity">What is the nature of your business activity?<span className="text-red-500 ml-1">*</span></Label>
            <Textarea
              id="businessActivity"
              name="businessActivity"
              required
              rows={2}
              value={formData.businessActivity}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('businessActivity') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('businessActivity')}
              aria-describedby={hasError('businessActivity') ? 'error-businessActivity' : undefined}
              onBlur={() => markAsTouched('businessActivity')}
              maxLength={fieldLimits.businessActivity}
            />
            {hasError('businessActivity') && (
              <p id="error-businessActivity" className="mt-1 text-xs text-red-500">{errors.businessActivity}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">OFFICEHOLDER DETAILS</h3>

          <div>
            <Label htmlFor="fullName">Full name<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('fullName') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('fullName')}
              aria-describedby={hasError('fullName') ? 'error-fullName' : undefined}
              onBlur={() => markAsTouched('fullName')}
            />
            {hasError('fullName') && (
              <p id="error-fullName" className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="residentialAddress">Residential address<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="residentialAddress"
              name="residentialAddress"
              required
              value={formData.residentialAddress}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('residentialAddress') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('residentialAddress')}
              aria-describedby={hasError('residentialAddress') ? 'error-residentialAddress' : undefined}
              onBlur={() => markAsTouched('residentialAddress')}
            />
            {hasError('residentialAddress') && (
              <p id="error-residentialAddress" className="mt-1 text-xs text-red-500">{errors.residentialAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of birth<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('dateOfBirth') ? 'border-red-500' : ''}`}
                aria-invalid={hasError('dateOfBirth')}
                aria-describedby={hasError('dateOfBirth') ? 'error-dateOfBirth' : undefined}
                onBlur={() => markAsTouched('dateOfBirth')}
              />
              {hasError('dateOfBirth') && (
                <p id="error-dateOfBirth" className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <Label htmlFor="placeOfBirth">Place of birth (town and state)<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="placeOfBirth"
                name="placeOfBirth"
                required
                value={formData.placeOfBirth}
                onChange={handleChange}
                placeholder="e.g. Sydney, NSW"
                className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('placeOfBirth') ? 'border-red-500' : ''}`}
                aria-invalid={hasError('placeOfBirth')}
                aria-describedby={hasError('placeOfBirth') ? 'error-placeOfBirth' : undefined}
                onBlur={() => markAsTouched('placeOfBirth')}
              />
              {hasError('placeOfBirth') && (
                <p id="error-placeOfBirth" className="mt-1 text-xs text-red-500">{errors.placeOfBirth}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="officeHeld">Office held</Label>
            <select
              name="officeHeld"
              id="officeHeld"
              value={formData.officeHeld}
              onChange={handleChange}
              className={`w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('officeHeld') ? 'border-red-500' : ''}`}
              onBlur={() => markAsTouched('officeHeld')}
            >
              <option value="Director">Director</option>
              <option value="Secretary">Secretary</option>
              <option value="Public Officer">Public Officer</option>
            </select>
            {hasError('officeHeld') && (
              <p id="error-officeHeld" className="mt-1 text-xs text-red-500">{errors.officeHeld}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">SHAREHOLDER DETAILS</h3>

          <div>
            <Label htmlFor="shareholderName">Full Name<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="shareholderName"
              name="shareholderName"
              required
              value={formData.shareholderName}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('shareholderName') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('shareholderName')}
              aria-describedby={hasError('shareholderName') ? 'error-shareholderName' : undefined}
              onBlur={() => markAsTouched('shareholderName')}
            />
            {hasError('shareholderName') && (
              <p id="error-shareholderName" className="mt-1 text-xs text-red-500">{errors.shareholderName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="shareholderACN">A.C.N. if company</Label>
            <Input 
              id="shareholderACN" 
              name="shareholderACN" 
              value={formData.shareholderACN} 
              onChange={handleChange} 
              maxLength={9}
              placeholder="e.g. 123456789"
              onBlur={() => markAsTouched('shareholderACN')}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('shareholderACN') ? 'border-red-500' : ''}`}
            />
            {hasError('shareholderACN') && (
              <p id="error-shareholderACN" className="mt-1 text-xs text-red-500">{errors.shareholderACN}</p>
            )}
          </div>

          <div>
            <Label htmlFor="shareholderAddress">Address<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="shareholderAddress"
              name="shareholderAddress"
              required
              value={formData.shareholderAddress}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('shareholderAddress') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('shareholderAddress')}
              aria-describedby={hasError('shareholderAddress') ? 'error-shareholderAddress' : undefined}
              onBlur={() => markAsTouched('shareholderAddress')}
            />
            {hasError('shareholderAddress') && (
              <p id="error-shareholderAddress" className="mt-1 text-xs text-red-500">{errors.shareholderAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numberOfShares">Number of shares</Label>
              <Input
                id="numberOfShares"
                name="numberOfShares"
                required
                value={formData.numberOfShares}
                onChange={handleChange}
                onBlur={() => markAsTouched('numberOfShares')}
                className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('numberOfShares') ? 'border-red-500' : ''}`}
              />
              {hasError('numberOfShares') && (
                <p id="error-numberOfShares" className="mt-1 text-xs text-red-500">{errors.numberOfShares}</p>
              )}
            </div>

            <div>
              <Label htmlFor="classOfShares">Class of shares</Label>
              <Input
                id="classOfShares"
                name="classOfShares"
                required
                value={formData.classOfShares}
                onChange={handleChange}
                onBlur={() => markAsTouched('classOfShares')}
                className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('classOfShares') ? 'border-red-500' : ''}`}
              />
              {hasError('classOfShares') && (
                <p id="error-classOfShares" className="mt-1 text-xs text-red-500">{errors.classOfShares}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pricePerShare">Price paid per share</Label>
              <Input
                id="pricePerShare"
                name="pricePerShare"
                required
                value={formData.pricePerShare}
                onChange={handleChange}
                onBlur={() => markAsTouched('pricePerShare')}
                className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('pricePerShare') ? 'border-red-500' : ''}`}
              />
              {hasError('pricePerShare') && (
                <p id="error-pricePerShare" className="mt-1 text-xs text-red-500">{errors.pricePerShare}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Whether the shares are beneficially held or not i.e. are they held in Trust for another party?</Label>
            <RadioGroup
              name="beneficiallyHeld"
              value={formData.beneficiallyHeld}
              onValueChange={(value) => handleRadioChange("beneficiallyHeld", value)}
              className="flex items-center space-x-4"
              onBlur={() => markAsTouched('beneficiallyHeld')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="beneficially-yes" />
                <Label htmlFor="beneficially-yes">Yes - Beneficially held</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="beneficially-no" />
                <Label htmlFor="beneficially-no">No - Held in trust</Label>
              </div>
            </RadioGroup>
            {hasError('beneficiallyHeld') && (
              <p id="error-beneficiallyHeld" className="mt-1 text-xs text-red-500">{errors.beneficiallyHeld}</p>
            )}
          </div>

          <div>
            <Label htmlFor="idDocuments">Attach ID of the shareholders and directors</Label>
            <FileUpload
              id="idDocuments"
              name="idDocuments"
              value={formData.idDocuments}
              onChange={(file) => {
                setFormData((prev) => ({ ...prev, idDocuments: file }))
                markAsTouched('idDocuments')
              }}
              onDelete={() => setFormData((prev) => ({ ...prev, idDocuments: null }))}
              accept="application/pdf,image/jpeg,image/png"
              error={hasError('idDocuments') ? errors.idDocuments : undefined}
              required={false}
              // label="Attach ID of the shareholders and directors"
            />
            {hasError('idDocuments') && (
              <p id="error-idDocuments" className="mt-1 text-xs text-red-500">{errors.idDocuments}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">ABN REGISTRATION CHECKLIST</h3>

          <div>
            <Label>Is the applicant a resident of Australia for tax purposes?</Label>
            <RadioGroup
              name="isResident"
              value={formData.isResident}
              onValueChange={(value) => handleRadioChange("isResident", value)}
              className="flex items-center space-x-4"
              onBlur={() => markAsTouched('isResident')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="resident-yes" />
                <Label htmlFor="resident-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="resident-no" />
                <Label htmlFor="resident-no">NO</Label>
              </div>
            </RadioGroup>
            {hasError('isResident') && (
              <p id="error-isResident" className="mt-1 text-xs text-red-500">{errors.isResident}</p>
            )}
          </div>

          <div>
            <Label htmlFor="abnReason">Why is the applicant applying for an ABN?</Label>
            <select
              name="abnReason"
              id="abnReason"
              value={formData.abnReason}
              onChange={handleChange}
              className={`w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('abnReason') ? 'border-red-500' : ''}`}
              onBlur={() => markAsTouched('abnReason')}
            >
              <option value="new-business">Starting a new business</option>
              <option value="takeover">Taking over an existing business</option>
              <option value="change-structure">Changing business structure</option>
              <option value="investment">Investment purposes</option>
              <option value="other">Other</option>
            </select>
            {hasError('abnReason') && (
              <p id="error-abnReason" className="mt-1 text-xs text-red-500">{errors.abnReason}</p>
            )}

            {formData.abnReason === "other" && (
              <div className="mt-2">
                <Input
                  id="abnReasonOther"
                  name="abnReasonOther"
                  placeholder="Please specify"
                  required
                  value={formData.abnReasonOther}
                  onChange={handleChange}
                  onBlur={() => markAsTouched('abnReasonOther')}
                  className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('abnReasonOther') ? 'border-red-500' : ''}`}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Is this the first time they have had a business in Australia?</Label>
              <RadioGroup
                name="firstBusinessInAus"
                value={formData.firstBusinessInAus}
                onValueChange={(value) => handleRadioChange("firstBusinessInAus", value)}
                className="flex items-center space-x-4"
                onBlur={() => markAsTouched('firstBusinessInAus')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="first-business-yes" />
                  <Label htmlFor="first-business-yes">YES</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="first-business-no" />
                  <Label htmlFor="first-business-no">NO</Label>
                </div>
              </RadioGroup>
              {hasError('firstBusinessInAus') && (
                <p id="error-firstBusinessInAus" className="mt-1 text-xs text-red-500">{errors.firstBusinessInAus}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="registrationDate">From what date does the applicant require these registrations?</Label>
              <Input
                id="registrationDate"
                name="registrationDate"
                type="date"
                required
                value={formData.registrationDate}
                onChange={handleChange}
                onBlur={() => markAsTouched('registrationDate')}
                className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('registrationDate') ? 'border-red-500' : ''}`}
              />
              {hasError('registrationDate') && (
                <p id="error-registrationDate" className="mt-1 text-xs text-red-500">{errors.registrationDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Will the applicant will be in business for less than 3 months?</Label>
              <RadioGroup
                name="lessThanThreeMonths"
                value={formData.lessThanThreeMonths}
                onValueChange={(value) => handleRadioChange("lessThanThreeMonths", value)}
                className="flex items-center space-x-4"
                onBlur={() => markAsTouched('lessThanThreeMonths')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="less-than-three-yes" />
                  <Label htmlFor="less-than-three-yes">YES</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="less-than-three-no" />
                  <Label htmlFor="less-than-three-no">NO</Label>
                </div>
              </RadioGroup>
              {hasError('lessThanThreeMonths') && (
                <p id="error-lessThanThreeMonths" className="mt-1 text-xs text-red-500">{errors.lessThanThreeMonths}</p>
              )}
            </div>

            {formData.lessThanThreeMonths === "yes" && (
              <div>
                <Label htmlFor="ceaseActivityDate">What date do they expect to cease activity?</Label>
                <Input
                  id="ceaseActivityDate"
                  name="ceaseActivityDate"
                  type="date"
                  required
                  value={formData.ceaseActivityDate}
                  onChange={handleChange}
                  onBlur={() => markAsTouched('ceaseActivityDate')}
                  className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('ceaseActivityDate') ? 'border-red-500' : ''}`}
                />
                {hasError('ceaseActivityDate') && (
                  <p id="error-ceaseActivityDate" className="mt-1 text-xs text-red-500">{errors.ceaseActivityDate}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label>Does the applicant have more than one business location in Australia?</Label>
            <RadioGroup
              name="multipleLocations"
              value={formData.multipleLocations}
              onValueChange={(value) => handleRadioChange("multipleLocations", value)}
              className="flex items-center space-x-4"
              onBlur={() => markAsTouched('multipleLocations')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="multiple-locations-yes" />
                <Label htmlFor="multiple-locations-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="multiple-locations-no" />
                <Label htmlFor="multiple-locations-no">NO</Label>
              </div>
            </RadioGroup>
            {hasError('multipleLocations') && (
              <p id="error-multipleLocations" className="mt-1 text-xs text-red-500">{errors.multipleLocations}</p>
            )}
          </div>

          <div>
            <Label>Is the applicant owned or controlled by Commonwealth, State, Territory or Local Government?</Label>
            <RadioGroup
              name="governmentOwned"
              value={formData.governmentOwned}
              onValueChange={(value) => handleRadioChange("governmentOwned", value)}
              className="flex items-center space-x-4"
              onBlur={() => markAsTouched('governmentOwned')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="government-owned-yes" />
                <Label htmlFor="government-owned-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="government-owned-no" />
                <Label htmlFor="government-owned-no">NO</Label>
              </div>
            </RadioGroup>
            {hasError('governmentOwned') && (
              <p id="error-governmentOwned" className="mt-1 text-xs text-red-500">{errors.governmentOwned}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mainIndustry">What is the main Industry in which the applicant operates?</Label>
            <Input
              id="mainIndustry"
              name="mainIndustry"
              required
              value={formData.mainIndustry}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('mainIndustry') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('mainIndustry')}
              aria-describedby={hasError('mainIndustry') ? 'error-mainIndustry' : undefined}
              onBlur={() => markAsTouched('mainIndustry')}
            />
            {hasError('mainIndustry') && (
              <p id="error-mainIndustry" className="mt-1 text-xs text-red-500">{errors.mainIndustry}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mainActivity">What is the main activity from which the applicant derives its income?</Label>
            <Input
              id="mainActivity"
              name="mainActivity"
              required
              value={formData.mainActivity}
              onChange={handleChange}
              className={`peer block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${hasError('mainActivity') ? 'border-red-500' : ''}`}
              aria-invalid={hasError('mainActivity')}
              aria-describedby={hasError('mainActivity') ? 'error-mainActivity' : undefined}
              onBlur={() => markAsTouched('mainActivity')}
            />
            {hasError('mainActivity') && (
              <p id="error-mainActivity" className="mt-1 text-xs text-red-500">{errors.mainActivity}</p>
            )}
          </div>

          <div>
            <Label>Does the applicant operate an agricultural property?</Label>
            <RadioGroup
              name="agriculturalProperty"
              value={formData.agriculturalProperty}
              onValueChange={(value) => handleRadioChange("agriculturalProperty", value)}
              className="flex items-center space-x-4"
              onBlur={() => markAsTouched('agriculturalProperty')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="agricultural-yes" />
                <Label htmlFor="agricultural-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="agricultural-no" />
                <Label htmlFor="agricultural-no">NO</Label>
              </div>
            </RadioGroup>
            {hasError('agriculturalProperty') && (
              <p id="error-agriculturalProperty" className="mt-1 text-xs text-red-500">{errors.agriculturalProperty}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Progress"}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Form"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CompanyRegistrationForm