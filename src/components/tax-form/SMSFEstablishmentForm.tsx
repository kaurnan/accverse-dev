"use client"

import { Textarea } from "../ui/textarea"
import { useNavigate } from 'react-router-dom'

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"
import { taxSolutionsService } from "../../services/api"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { validateForm, scrollToFirstError } from "../../utils/form-validation"
import { FormErrorSummary } from "../ui/form-error-summary"

interface SMSFEstablishmentFormProps {
  formType: string;
}

// Field maximum lengths
const MAX_LENGTHS = {
  name: 100,
  firmName: 100,
  address: 150,
  city: 50,
  postalCode: 10,
  phone: 15,
  email: 100,
  companyName: 100,
  fundName: 100,
  additionalInfo: 500
};

const SMSFEstablishmentForm: React.FC<SMSFEstablishmentFormProps> = ({ formType }) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    contactName: "",
    firmName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Australia",
    mobile: "",
    workPhone: "",
    homePhone: "",
    email: "",
    hasFinancialPlanner: "no",
    receivedAdvice: "no",
    adviceDocument: null as File | null,
    proposedCompanyName1: "",
    proposedCompanyName2: "",
    sharesPerDirector: "6",
    stateOfRegistration: "NSW",
    actAsASICAgent: "yes",
    registeredOfficeAddress: "",
    registeredOfficeCity: "",
    registeredOfficeState: "",
    registeredOfficePostalCode: "",
    registeredOfficeCountry: "Australia",
    sameAsPrincipalPlace: "yes",
    principalPlaceOfBusiness: "",
    principalPlaceCity: "",
    principalPlaceState: "",
    principalPlacePostalCode: "",
    principalPlaceCountry: "Australia",
    proposedFundName: "",
    directorCount: "2",
    openMacquarieCMA: "yes",
    deliveryMethod: "electronic",
    additionalInformation: "",
    trusteeDeclaration: false,
  })
  const [loading, setLoading] = useState(false)
  const [formId, setFormId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showValidation, setShowValidation] = useState(false)

  // Custom validation function only for SMSF establishment form fields
  const validateSMSFEstablishmentForm = () => {
    const validationErrors: Record<string, string> = {};
    
    // Only validate fields that actually exist in this form
    if (showValidation || touched.contactName) {
      if (!formData.contactName) {
        validationErrors.contactName = "Contact name is required";
      }
    }
    
    if (showValidation || touched.email) {
      if (!formData.email) {
        validationErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        validationErrors.email = "Please enter a valid email address";
      }
    }
    
    if (showValidation || touched.mobile) {
      if (!formData.mobile) {
        validationErrors.mobile = "Mobile number is required";
      } else if (!/^\d+$/.test(formData.mobile)) {
        validationErrors.mobile = "Mobile number should contain only digits";
      }
    }
    
    if (showValidation || touched.address) {
      if (!formData.address) {
        validationErrors.address = "Address is required";
      }
    }
    
    if (showValidation || touched.city) {
      if (!formData.city) {
        validationErrors.city = "City is required";
      } else if (/\d/.test(formData.city)) {
        validationErrors.city = "City name should not contain numbers";
      }
    }
    
    if (showValidation || touched.state) {
      if (!formData.state) {
        validationErrors.state = "State is required";
      }
    }
    
    if (showValidation || touched.postalCode) {
      if (!formData.postalCode) {
        validationErrors.postalCode = "Postal code is required";
      } else if (!/^\d+$/.test(formData.postalCode)) {
        validationErrors.postalCode = "Postal code should contain only digits";
      }
    }
    
    if (showValidation || touched.registeredOfficeAddress) {
      if (!formData.registeredOfficeAddress) {
        validationErrors.registeredOfficeAddress = "Registered office address is required";
      }
    }
    
    if (showValidation || touched.registeredOfficeCity) {
      if (!formData.registeredOfficeCity) {
        validationErrors.registeredOfficeCity = "City is required";
      } else if (/\d/.test(formData.registeredOfficeCity)) {
        validationErrors.registeredOfficeCity = "City name should not contain numbers";
      }
    }
    
    if (showValidation || touched.registeredOfficeState) {
      if (!formData.registeredOfficeState) {
        validationErrors.registeredOfficeState = "State is required";
      }
    }
    
    if (showValidation || touched.registeredOfficePostalCode) {
      if (!formData.registeredOfficePostalCode) {
        validationErrors.registeredOfficePostalCode = "Postal code is required";
      } else if (!/^\d+$/.test(formData.registeredOfficePostalCode)) {
        validationErrors.registeredOfficePostalCode = "Postal code should contain only digits";
      }
    }
    
    if (showValidation || touched.proposedFundName) {
      if (!formData.proposedFundName) {
        validationErrors.proposedFundName = "Fund name is required";
      }
    }
    
    if (showValidation) {
      if (!formData.trusteeDeclaration) {
        validationErrors.trusteeDeclaration = "You must agree to the trustee declaration";
      }
    }
    
    // Validate proposed company names
    if (showValidation || touched.proposedCompanyName1) {
      if (!formData.proposedCompanyName1) {
        validationErrors.proposedCompanyName1 = "Proposed company name is required";
      }
    }
    
    return validationErrors;
  }

  useEffect(() => {
    // Use the custom validation function specifically for this form
    setErrors(validateSMSFEstablishmentForm());
  }, [formData, touched, showValidation]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    
    // Apply input restrictions based on field type
    let validatedValue = value;
    
    // For fields that should only contain numbers
    if (name === 'mobile' || name === 'workPhone' || name === 'homePhone' || 
        name === 'postalCode' || name === 'registeredOfficePostalCode' || 
        name === 'principalPlacePostalCode') {
      validatedValue = value.replace(/\D/g, ''); // Remove non-digit characters
      
      // Apply length restrictions for numeric fields
      if (name.includes('postalCode')) {
        validatedValue = validatedValue.slice(0, 10);
      } else if (name.includes('Phone')) {
        validatedValue = validatedValue.slice(0, 15);
      }
    }
    // For fields that should only contain letters (and spaces)
    else if (name === 'city' || name === 'registeredOfficeCity' || name === 'principalPlaceCity') {
      validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
      validatedValue = validatedValue.slice(0, MAX_LENGTHS.city);
    }
    // For name fields with length restrictions
    else if (name === 'contactName' || name === 'firmName') {
      validatedValue = validatedValue.slice(0, MAX_LENGTHS.name);
    }
    // For company name fields
    else if (name === 'proposedCompanyName1' || name === 'proposedCompanyName2') {
      validatedValue = validatedValue.slice(0, MAX_LENGTHS.companyName);
    }
    // For address fields
    else if (name === 'address' || name === 'registeredOfficeAddress' || name === 'principalPlaceOfBusiness') {
      validatedValue = validatedValue.slice(0, MAX_LENGTHS.address);
    }
    // For fund name
    else if (name === 'proposedFundName') {
      validatedValue = validatedValue.slice(0, MAX_LENGTHS.fundName);
    }
    // For email field
    else if (name === 'email') {
      validatedValue = validatedValue.slice(0, MAX_LENGTHS.email);
    }
    // For additional information
    else if (name === 'additionalInformation') {
      validatedValue = validatedValue.slice(0, MAX_LENGTHS.additionalInfo);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : validatedValue,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.files?.[0] || null,
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    // Save form data to localStorage with the correct form type
    try {
      const dataToSave = {
        ...formData,
        formType: "smsf-establishment"
      };
      
      localStorage.setItem('smsfFormData', JSON.stringify(dataToSave));
      
      toast({
        title: "Progress Saved",
        description: "Your progress has been saved. You can continue later.",
      });
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your progress",
        variant: "destructive",
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Set showValidation to true to display all errors
    setShowValidation(true)

    // Use the custom validation for this form
    const validationErrors = validateSMSFEstablishmentForm();
    setErrors(validationErrors)

    // Check trustee declaration
    if (!formData.trusteeDeclaration) {
      toast({
        title: "Error",
        description: "You must agree to the trustee declaration",
      })

      // Scroll to declaration
      const declarationElement = document.getElementById("trusteeDeclaration")
      if (declarationElement) {
        declarationElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      return
    }

    // If there are errors, show toast and scroll to first error
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors)

      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const formDataObj = new FormData()

      // Add form type
      formDataObj.append("formType", "smsf-establishment")

      // Create a copy of the form data without the file
      const { adviceDocument, ...jsonData } = formData

      // Add JSON data
      formDataObj.append("formData", JSON.stringify(jsonData))

      // Append file if available
      if (formData.adviceDocument) {
        formDataObj.append("adviceDocument", formData.adviceDocument)
      }

      console.log("Submitting SMSF establishment form")
      const response = await taxSolutionsService.submitTaxForm(formDataObj)
      console.log("Form submission response:", response)
      
      // Clear localStorage after successful submission
      localStorage.removeItem('smsfFormData');

      toast({
        title: "Form Submitted",
        description: "Your SMSF establishment form has been submitted successfully",
      })

      // Redirect to payment page with form data
      navigate('/smsf-establishment-payment', {
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

  // Helper function to determine if an input should show an error
  const shouldShowError = (fieldName: string): boolean => {
    return (touched[fieldName] || showValidation) && !!errors[fieldName];
  }

  // Helper function to get error message if it should be shown
  const getErrorMessage = (fieldName: string): string | undefined => {
    return shouldShowError(fieldName) ? errors[fieldName] : undefined;
  }

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('smsfFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Only load data if it's for the correct form type
        if (parsedData.formType === "smsf-establishment") {
          // Remove the file object as it can't be stored in localStorage
          const { adviceDocument, ...restData } = parsedData;
          setFormData(prevData => ({ ...prevData, ...restData }));
          
          toast({
            title: "Form Progress Loaded",
            description: "Your previous progress has been loaded."
          });
        }
      } catch (err) {
        console.error("Error parsing saved form data:", err);
      }
    }
  }, []);

  // Helper function to render required field asterisk
  const requiredField = () => <span className="text-red-500">*</span>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <FormErrorSummary errors={errors} visible={showValidation} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">SMSF Establishment Form</h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Customer Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactName">
                Contact Name {requiredField()}
              </Label>
              <Input
                id="contactName"
                name="contactName"
                required
                value={formData.contactName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getErrorMessage("contactName")}
                maxLength={MAX_LENGTHS.name}
                placeholder="Person submitting this application"
              />
            </div>

            <div>
              <Label htmlFor="firmName">Firm Name</Label>
              <Input 
                id="firmName" 
                name="firmName" 
                value={formData.firmName} 
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={MAX_LENGTHS.firmName}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address {requiredField()}</Label>
            <Input
              id="address"
              name="address"
              placeholder="Address"
              required
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getErrorMessage("address")}
              maxLength={MAX_LENGTHS.address}
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="city">City {requiredField()}</Label>
                <Input 
                  id="city" 
                  name="city" 
                  required 
                  value={formData.city} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={getErrorMessage("city")}
                  maxLength={MAX_LENGTHS.city}
                />
              </div>

              <div>
                <Label htmlFor="state">State {requiredField()}</Label>
                <select
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${shouldShowError("state") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                {shouldShowError("state") && (
                  <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="postalCode">Postal Code {requiredField()}</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  required 
                  value={formData.postalCode} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={getErrorMessage("postalCode")}
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="country">Country {requiredField()}</Label>
                <Input 
                  id="country" 
                  name="country" 
                  required 
                  value={formData.country} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label htmlFor="mobile">Mobile {requiredField()}</Label>
              <Input 
                id="mobile" 
                name="mobile" 
                required 
                value={formData.mobile} 
                onChange={handleChange}
                onBlur={handleBlur}
                error={getErrorMessage("mobile")}
                maxLength={15}
                inputMode="numeric"
              />
            </div>

            <div>
              <Label htmlFor="workPhone">Work Phone</Label>
              <Input 
                id="workPhone" 
                name="workPhone" 
                value={formData.workPhone} 
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={15}
                inputMode="numeric"
              />
            </div>

            <div>
              <Label htmlFor="homePhone">Home Phone</Label>
              <Input 
                id="homePhone" 
                name="homePhone" 
                value={formData.homePhone} 
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={15}
                inputMode="numeric"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">
              Email Address {requiredField()}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getErrorMessage("email")}
              maxLength={MAX_LENGTHS.email}
            />
          </div>

          <div>
            <Label>Do you have a Financial Planner?</Label>
            <RadioGroup
              name="hasFinancialPlanner"
              value={formData.hasFinancialPlanner}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, hasFinancialPlanner: value }))} 
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="financial-planner-yes" />
                <Label htmlFor="financial-planner-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="financial-planner-no" />
                <Label htmlFor="financial-planner-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.hasFinancialPlanner === "yes" && (
            <div>
              <Label>Did you receive an advice from your Financial Planner to establish the SMSF?</Label>
              <RadioGroup
                name="receivedAdvice"
                value={formData.receivedAdvice}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, receivedAdvice: value }))} 
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="received-advice-yes" />
                  <Label htmlFor="received-advice-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="received-advice-no" />
                  <Label htmlFor="received-advice-no">No</Label>
                </div>
              </RadioGroup>

              {formData.receivedAdvice === "yes" && (
                <div className="mt-2">
                  <Label htmlFor="adviceDocument">If yes, please upload the advice document</Label>
                  <Input id="adviceDocument" name="adviceDocument" type="file" onChange={handleFileChange} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Corporate Trustee Name (subject to availability)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proposedCompanyName1">
                Proposed Company Name 1 {requiredField()}
              </Label>
              <Input
                id="proposedCompanyName1"
                name="proposedCompanyName1"
                required
                value={formData.proposedCompanyName1}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getErrorMessage("proposedCompanyName1")}
                maxLength={MAX_LENGTHS.companyName}
              />
            </div>

            <div>
              <Label htmlFor="proposedCompanyName2">Proposed Company Name 2</Label>
              <Input
                id="proposedCompanyName2"
                name="proposedCompanyName2"
                value={formData.proposedCompanyName2}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={MAX_LENGTHS.companyName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sharesPerDirector">Number of shares to be allocated per director</Label>
              <select
                name="sharesPerDirector"
                id="sharesPerDirector"
                value={formData.sharesPerDirector}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="6">6 (Default)</option>
                <option value="10">10</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Our default position is to allocate 6 Ordinary shares per director of the corporate trustee.
              </p>
            </div>

            <div>
              <Label htmlFor="stateOfRegistration">State of Registration</Label>
              <select
                name="stateOfRegistration"
                id="stateOfRegistration"
                value={formData.stateOfRegistration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>
          </div>

          <div>
            <Label>Will Accverse Act as ASIC Agent for the Corporate Trustee</Label>
            <RadioGroup
              name="actAsASICAgent"
              value={formData.actAsASICAgent}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, actAsASICAgent: value }))} 
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="asic-agent-yes" />
                <Label htmlFor="asic-agent-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="asic-agent-no" />
                <Label htmlFor="asic-agent-no">No</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 mt-1">
              (Note: An additional fee of $100.00 plus GST per annum will apply if you appoint us as ASIC agent)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Registered Office Address {requiredField()}
          </h3>
          <p className="text-sm text-gray-500">(can be your residential address)</p>

          <div>
            <Input
              id="registeredOfficeAddress"
              name="registeredOfficeAddress"
              placeholder="Street Address"
              required
              value={formData.registeredOfficeAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getErrorMessage("registeredOfficeAddress")}
              maxLength={MAX_LENGTHS.address}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="registeredOfficeCity"
                name="registeredOfficeCity"
                placeholder="City"
                required
                value={formData.registeredOfficeCity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getErrorMessage("registeredOfficeCity")}
                maxLength={MAX_LENGTHS.city}
              />
            </div>

            <div>
              <select
                name="registeredOfficeState"
                id="registeredOfficeState"
                value={formData.registeredOfficeState}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border ${shouldShowError("registeredOfficeState") ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {shouldShowError("registeredOfficeState") && (
                <p className="mt-1 text-xs text-red-500">{errors.registeredOfficeState}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="registeredOfficePostalCode"
                name="registeredOfficePostalCode"
                placeholder="Postal Code"
                required
                value={formData.registeredOfficePostalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getErrorMessage("registeredOfficePostalCode")}
                maxLength={10}
                inputMode="numeric"
              />
            </div>

            <div>
              <Input
                id="registeredOfficeCountry"
                name="registeredOfficeCountry"
                placeholder="Country"
                required
                value={formData.registeredOfficeCountry}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div>
            <Label>Is the Principal Place of Business the same as the Registered Office Address above?</Label>
            <RadioGroup
              name="sameAsPrincipalPlace"
              value={formData.sameAsPrincipalPlace}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, sameAsPrincipalPlace: value }))} 
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="same-address-yes" />
                <Label htmlFor="same-address-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="same-address-no" />
                <Label htmlFor="same-address-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.sameAsPrincipalPlace === "no" && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Principal Place of Business</h3>

              <div>
                <Input
                  id="principalPlaceOfBusiness"
                  name="principalPlaceOfBusiness"
                  placeholder="Street Address"
                  required
                  value={formData.principalPlaceOfBusiness}
                  onChange={handleChange}
                  maxLength={MAX_LENGTHS.address}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="principalPlaceCity"
                    name="principalPlaceCity"
                    placeholder="City"
                    required
                    value={formData.principalPlaceCity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={MAX_LENGTHS.city}
                  />
                </div>

                <div>
                  <select
                    name="principalPlaceState"
                    id="principalPlaceState"
                    value={formData.principalPlaceState}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="principalPlacePostalCode"
                    name="principalPlacePostalCode"
                    placeholder="Postal Code"
                    required
                    value={formData.principalPlacePostalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={10}
                    inputMode="numeric"
                  />
                </div>

                <div>
                  <Input
                    id="principalPlaceCountry"
                    name="principalPlaceCountry"
                    placeholder="Country"
                    required
                    value={formData.principalPlaceCountry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="proposedFundName">
              Proposed Superannuation Fund Name {requiredField()}
            </Label>
            <Input
              id="proposedFundName"
              name="proposedFundName"
              required
              value={formData.proposedFundName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getErrorMessage("proposedFundName")}
              maxLength={MAX_LENGTHS.fundName}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="directorCount">How many directors will the fund have on establishment?</Label>
              <select
                name="directorCount"
                id="directorCount"
                value={formData.directorCount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div>
              <Label>Would you like for us to submit an application with Macquarie to open a Macquarie CMA?</Label>
              <RadioGroup
                name="openMacquarieCMA"
                value={formData.openMacquarieCMA}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, openMacquarieCMA: value }))} 
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="macquarie-cma-yes" />
                  <Label htmlFor="macquarie-cma-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="macquarie-cma-no" />
                  <Label htmlFor="macquarie-cma-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div>
            <Label>Method of Delivery</Label>
            <RadioGroup
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, deliveryMethod: value }))} 
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="electronic" id="delivery-electronic" />
                <Label htmlFor="delivery-electronic">Electronic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hardcopy" id="delivery-hardcopy" />
                <Label htmlFor="delivery-hardcopy">Hard Copy - additional charges will apply</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="additionalInformation">Additional Information / Special instructions</Label>
            <Textarea
              id="additionalInformation"
              name="additionalInformation"
              rows={4}
              value={formData.additionalInformation}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={MAX_LENGTHS.additionalInfo}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.additionalInformation.length}/{MAX_LENGTHS.additionalInfo} characters
            </p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Input
              id="trusteeDeclaration"
              name="trusteeDeclaration"
              type="checkbox"
              className="mt-1"
              checked={formData.trusteeDeclaration}
              onChange={handleChange}
            />
            <Label htmlFor="trusteeDeclaration" className="font-semibold">
              Trustee Declaration {requiredField()}
            </Label>
          </div>
          <p className="ml-6 mt-2">
            I hereby authorise Accverse to complete and lodge the ABN and TFN application for this Fund on behalf of the
            trustees, and declare that all information provided in this application form is true and correct. The ATO
            may contact you as a trustee of the fund to confirm that you understand their duties and obligations as a
            trustee.
          </p>
          {shouldShowError("trusteeDeclaration") && (
            <p className="ml-6 mt-1 text-sm text-red-500">You must agree to the trustee declaration</p>
          )}
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Progress"}
          </Button>
          <Button type="submit" disabled={loading || !formData.trusteeDeclaration}>
            {loading ? "Submitting..." : "Submit and Proceed to Payment"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SMSFEstablishmentForm