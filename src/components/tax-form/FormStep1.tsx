"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { SecuredBankingSection } from "../ui/secured-banking-section"
import { Info } from "lucide-react"
import { FileUpload } from "../ui/file-upload"

interface FormStep1Props {
  formData: Record<string, any>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleRadioChange: (name: string, value: string) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void
  handleFileDelete?: (fieldName: string) => void
  errors: Record<string, string>
}

const FormStep1: React.FC<FormStep1Props> = ({
  formData,
  handleChange,
  handleRadioChange,
  handleFileChange,
  handleFileDelete,
  errors,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const markAsTouched = (fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    markAsTouched(name)
  }

  const handleFileDrop = (file: File | null, fieldName: string) => {
    if (file) {
      const event = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileChange(event, fieldName)
    } else if (handleFileDelete) {
      handleFileDelete(fieldName)
    }
  }

  // --- BEGIN: Add local required validation for banking fields, only after touched ---
  // This ensures that required banking fields are visually marked and errors shown if missing,
  // but only after the user has interacted with them.
  const bankingFields = [
    { name: "bankBsb", label: "BSB Number" },
    { name: "bankAccountNo", label: "Account Number" },
    { name: "confirmAccountNo", label: "Confirm Account Number" },
    { name: "bankAccountName", label: "Account Name" },
    { name: "bankName", label: "Bank Name" },
  ]

  // Helper to check if a field is empty
  const isEmpty = (val: any) => !val || String(val).trim() === ""

  // Compose local errors for banking fields if not present in parent errors
  const localBankingErrors: Record<string, string> = {}
  bankingFields.forEach(field => {
    if (
      (field.name === "bankBsb" || field.name === "confirmAccountNo") &&
      isEmpty(formData[field.name]) &&
      !errors[field.name] &&
      touched[field.name] // Only show error if field has been touched
    ) {
      localBankingErrors[field.name] = `${field.label} is required`
    }
  })
  // --- END: Add local required validation for banking fields ---

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
          Part 1: Personal Information
        </h2>
        <p className="text-gray-600 mt-1">Please provide your personal details for tax purposes.</p>
      </div>

      <div className="space-y-6">
        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="taxpayerType" className="block text-gray-700 font-medium">
              Taxpayer Type <span className="text-red-500">*</span>
            </Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Taxpayer Type Information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Select your taxpayer category for proper tax assessment.
              </div>
            </div>
          </div>
          <select
            id="taxpayerType"
            name="taxpayerType"
            value={formData.taxpayerType ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border ${errors.taxpayerType ? "border-red-500 focus:ring-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select Type</option>
            <option value="individual">Individual</option>
            <option value="soleTrader">Sole Trader</option>
            {/* <option value="company">Company</option> */}
            {/* <option value="trust">Trust</option> */}
            {/* <option value="smsf">Self-Managed Super Fund</option> */}
          </select>
          {errors.taxpayerType && touched.taxpayerType && <p className="mt-1 text-xs text-red-500">{errors.taxpayerType}</p>}
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="form-group col-span-3">
            <div className="flex items-center mb-2">
              <Label htmlFor="prefix" className="block text-gray-700 font-medium">
                Title
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Title Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your preferred title or honorific.
                </div>
              </div>
            </div>
            <select
              id="prefix"
              name="prefix"
              value={formData.prefix ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border ${errors.prefix ? "border-red-500 focus:ring-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
            {errors.prefix && touched.prefix && <p className="mt-1 text-xs text-red-500">{errors.prefix}</p>}
          </div>

          <div className="form-group col-span-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="firstName" className="block text-gray-700 font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="First Name Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your legal first name as it appears on official documents.
                </div>
              </div>
            </div>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={50}
              className={`${errors.firstName ? "border-red-500" : ""}`}
            />
            {errors.firstName && touched.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
          </div>

          <div className="form-group col-span-5">
            <div className="flex items-center mb-2">
              <Label htmlFor="lastName" className="block text-gray-700 font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Last Name Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your legal last name as it appears on official documents.
                </div>
              </div>
            </div>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={50}
              className={`${errors.lastName ? "border-red-500" : ""}`}
            />
            {errors.lastName && touched.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="dateOfBirth" className="block text-gray-700 font-medium">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Date of Birth Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your date of birth in DD/MM/YYYY format.
                </div>
              </div>
            </div>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              max={new Date().toISOString().split("T")[0]}
              className={`${errors.dateOfBirth ? "border-red-500" : ""}`}
            />
            {errors.dateOfBirth && touched.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="maritalStatus" className="block text-gray-700 font-medium">
                Marital Status
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Marital Status Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your current marital status for tax purposes.
                </div>
              </div>
            </div>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border ${errors.maritalStatus ? "border-red-500 focus:ring-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="defacto">De Facto</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
            {errors.maritalStatus && touched.maritalStatus && <p className="mt-1 text-xs text-red-500">{errors.maritalStatus}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="mobile" className="block text-gray-700 font-medium">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Mobile Number Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your current mobile number for contact purposes.
                </div>
              </div>
            </div>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={15}
              className={`${errors.mobile ? "border-red-500" : ""}`}
            />
            {errors.mobile && touched.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="email" className="block text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Email Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your email address for correspondence and notifications.
                </div>
              </div>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={100}
              className={`${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && touched.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="address" className="block text-gray-700 font-medium">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Address Line 1 Information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Your street address including house/unit number.
              </div>
            </div>
          </div>
          <Input
            id="address"
            name="address"
            value={formData.address ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={100}
            className={`${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && touched.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="address2" className="block text-gray-700 font-medium">
              Address Line 2
            </Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Address Line 2 Information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Additional address information if needed.
              </div>
            </div>
          </div>
          <Input
            id="address2"
            name="address2"
            value={formData.address2 ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={100}
            className={`${errors.address2 ? "border-red-500" : ""}`}
          />
          {errors.address2 && touched.address2 && <p className="mt-1 text-xs text-red-500">{errors.address2}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="suburb" className="block text-gray-700 font-medium">
                Suburb <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Suburb Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your city or suburb name.
                </div>
              </div>
            </div>
            <Input
              id="suburb"
              name="suburb"
              value={formData.suburb ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={50}
              className={`${errors.suburb ? "border-red-500" : ""}`}
            />
            {errors.suburb && touched.suburb && <p className="mt-1 text-xs text-red-500">{errors.suburb}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="state" className="block text-gray-700 font-medium">
                State <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="State Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Select your state or territory.
                </div>
              </div>
            </div>
            <select
              id="state"
              name="state"
              value={formData.state ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border ${errors.state ? "border-red-500 focus:ring-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select State</option>
              <option value="ACT">Australian Capital Territory</option>
              <option value="NSW">New South Wales</option>
              <option value="NT">Northern Territory</option>
              <option value="QLD">Queensland</option>
              <option value="SA">South Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="VIC">Victoria</option>
              <option value="WA">Western Australia</option>
            </select>
            {errors.state && touched.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="postcode" className="block text-gray-700 font-medium">
                Postcode <span className="text-red-500">*</span>
              </Label>
              <div className="group relative ml-2 inline-block">
                <button type="button" className="text-blue-500" aria-label="Postcode Information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your 4-digit Australian postal code.
                </div>
              </div>
            </div>
            <Input
              id="postcode"
              name="postcode"
              type="text"
              value={formData.postcode ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={4}
              className={`${errors.postcode ? "border-red-500" : ""}`}
            />
            {errors.postcode && touched.postcode && <p className="mt-1 text-xs text-red-500">{errors.postcode}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="taxFileNumber" className="block text-gray-700 font-medium">
              Tax File Number <span className="text-red-500">*</span>
            </Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Your unique TFN assigned by the ATO. This is stored securely.
              </div>
            </div>
          </div>
          <Input
            id="taxFileNumber"
            name="taxFileNumber"
            type="text"
            value={formData.taxFileNumber ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={9}
            className={`${errors.taxFileNumber ? "border-red-500" : ""}`}
          />
          {errors.taxFileNumber && touched.taxFileNumber && <p className="mt-1 text-xs text-red-500">{errors.taxFileNumber}</p>}
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <Label className="text-gray-800 font-semibold mb-1 block">
            Would you like to have GST services included?
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="GST information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                GST (Goods and Services Tax) is a 10% tax applied to most goods and services sold in Australia.
              </div>
            </div>
          </Label>
          <p className="text-sm text-gray-500 mb-3">Select Yes if you require our GST/BAS Lodgement services.</p>
          <RadioGroup
            value={formData.gstRequired || ""}
            onValueChange={(value: string) => handleRadioChange("gstRequired", value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="gstYes" />
              <Label htmlFor="gstYes" className="text-gray-700 cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="gstNo" />
              <Label htmlFor="gstNo" className="text-gray-700 cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
          {errors.gstRequired && touched.gstRequired && <p className="mt-1 text-xs text-red-500">{errors.gstRequired}</p>}
        </div>

        <div>
          <Label htmlFor="fiscalYear" className="flex items-center text-gray-700 mb-1">
            Fiscal Year Ended <span className="text-red-500">*</span>
            <div className="group relative ml-2">
              <button type="button" className="text-blue-500" aria-label="Fiscal Year information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                The fiscal year in Australia typically ends on June 30th.
              </div>
            </div>
          </Label>
          <Input
            id="fiscalYear"
            name="fiscalYear"
            type="date"
            value={formData.fiscalYear || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Do not insert multiple years"
            error={errors.fiscalYear}
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
            required
          />
          {errors.fiscalYear && touched.fiscalYear && <p className="mt-1 text-xs text-red-500">{errors.fiscalYear}</p>}
        </div>

        {/* Banking Details Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Secure Banking Details
              </h3>
              <div className="flex items-center text-sm text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                {/* Secured with 256-bit encryption */}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Your banking details are encrypted and stored securely. We use industry-standard security measures to protect your information.</p>
            <SecuredBankingSection
              formData={{
                bankBsb: formData.bankBsb || "",
                bankAccountNo: formData.bankAccountNo || "",
                bankAccountName: formData.bankAccountName || "",
                bankName: formData.bankName || "",
                confirmAccountNo: formData.confirmAccountNo || ""
              }}
              handleChange={handleChange}
              errors={{
                ...errors,
                ...localBankingErrors, // Inject local required errors for banking fields
              }}
              touched={touched}
              markAsTouched={markAsTouched}
            />
            {/* Show error messages for required banking fields if missing and touched */}
            <div className="mt-2 space-y-1">
              {bankingFields.map(field =>
                (localBankingErrors[field.name]) ? (
                  <p key={field.name} className="text-xs text-red-500">
                    {localBankingErrors[field.name]}
                  </p>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <Label className="text-gray-800 font-semibold mb-1 block">
            Would you authorise us to update your contact details with the ATO?
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="ATO information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                The ATO (Australian Taxation Office) is the government agency responsible for administering the tax
                system in Australia.
              </div>
            </div>
          </Label>
          <RadioGroup
            value={formData.updateAtoDetails || ""}
            onValueChange={(value: string) => handleRadioChange("updateAtoDetails", value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="updateAtoYes" />
              <Label htmlFor="updateAtoYes" className="text-gray-700 cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="updateAtoNo" />
              <Label htmlFor="updateAtoNo" className="text-gray-700 cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
          {errors.updateAtoDetails && touched.updateAtoDetails && <p className="mt-1 text-xs text-red-500">{errors.updateAtoDetails}</p>}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="idDocument" className="block text-gray-700 font-medium">
              ID Document <span className="text-red-500">*</span>
            </Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="ID Document Information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Upload a scan of your driver's license, passport or other government ID for verification purposes.
              </div>
            </div>
          </div>
          <FileUpload
            id="idDocument"
            name="idDocument"
            value={formData.idDocument}
            onChange={(file) => handleFileDrop(file, "idDocument")}
            onDelete={handleFileDelete}
            accept="application/pdf,image/jpeg,image/png"
            tooltip="Upload a government-issued ID for verification purposes"
            error={errors.idDocument}
            required={true}
          />
          {errors.idDocument && touched.idDocument && <p className="mt-1 text-xs text-red-500">{errors.idDocument}</p>}
        </div>
      </div>
    </div>
  )
}

export default FormStep1
