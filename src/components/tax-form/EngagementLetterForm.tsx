"use client"

import React, { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { SignatureField } from "../ui/signature-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { EngagementLetterData } from "../../types/form-types"
import { useToast } from "../../hooks/use-toast"
import { Checkbox } from "../ui/checkbox"

// Define FormData type here if not exported from form-types
type FormData = {
  businessName?: string
  entityName?: string
  streetAddress?: string
  streetAddress2?: string
  city?: string
  state?: string
  postcode?: string
  entityType?: string
  engagementLetter?: EngagementLetterData | null
  // Add any other fields as needed
}

interface EngagementLetterFormProps {
  formData: FormData
  setFormData: (data: FormData) => void
  onComplete: (data: FormData) => void
}

const EngagementLetterForm: React.FC<EngagementLetterFormProps> = ({ formData, setFormData, onComplete }) => {
  const { toast } = useToast()
  const [engagementData, setEngagementData] = useState<EngagementLetterData>({
    clientName: formData.businessName || formData.entityName || "",
    agreementDate: formData.engagementLetter?.agreementDate || new Date().toISOString().split("T")[0],
    signature: formData.engagementLetter?.signature || null,
    accepted: formData.engagementLetter?.accepted || false,
    dateSigned: formData.engagementLetter?.dateSigned || null,
    streetAddress: formData.engagementLetter?.streetAddress || formData.streetAddress || "",
    streetAddress2: formData.engagementLetter?.streetAddress2 || formData.streetAddress2 || "",
    suburb: formData.engagementLetter?.suburb || formData.city || "",
    state: formData.engagementLetter?.state || formData.state || "",
    postcode: formData.engagementLetter?.postcode || formData.postcode || "",
    entityType: formData.engagementLetter?.entityType || formData.entityType || "company",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [termsAccepted, setTermsAccepted] = useState(formData.engagementLetter?.accepted || false)

  // Fix: Add handleSelectChange for Select components
  const handleSelectChange = (name: string, value: string) => {
    setEngagementData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear any errors for the changed field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEngagementData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear any errors for the changed field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSignatureChange = (value: string) => {
    setEngagementData((prev) => ({
      ...prev,
      signature: value,
    }))

    // Clear signature error if it exists
    if (errors.signature) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.signature
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!engagementData.agreementDate) {
      newErrors.agreementDate = "Date is required"
    }
    if (!engagementData.clientName) {
      newErrors.clientName = "Client name is required"
    }
    if (!engagementData.streetAddress) {
      newErrors.streetAddress = "Street address is required"
    }
    if (!engagementData.suburb) {
      newErrors.suburb = "Suburb is required"
    }
    if (!engagementData.state) {
      newErrors.state = "State is required"
    }
    if (!engagementData.postcode) {
      newErrors.postcode = "Postcode is required"
    }
    if (!engagementData.entityType) {
      newErrors.entityType = "Entity type is required"
    }
    if (!engagementData.signature) {
      newErrors.signature = "Signature is required"
    }
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Please complete all required fields",
        description: "All fields marked with an asterisk (*) are required.",
        variant: "destructive",
      })
      return
    }

    const updatedEngagementData = {
      ...engagementData,
      accepted: true,
      dateSigned: new Date().toISOString(),
    }

    const updatedFormData = {
      ...formData,
      engagementLetter: updatedEngagementData,
    }

    setFormData(updatedFormData)
    onComplete(updatedFormData)
  }

  const stateOptions = [
    { value: "NSW", label: "New South Wales" },
    { value: "VIC", label: "Victoria" },
    { value: "QLD", label: "Queensland" },
    { value: "WA", label: "Western Australia" },
    { value: "SA", label: "South Australia" },
    { value: "TAS", label: "Tasmania" },
    { value: "ACT", label: "Australian Capital Territory" },
    { value: "NT", label: "Northern Territory" },
  ]

  const entityTypeOptions = [
    { value: "individual", label: "Individual / Sole Trader" },
    { value: "company", label: "Company" },
    { value: "partnership", label: "Partnership" },
    { value: "trust", label: "Trust" },
    { value: "smsf", label: "SMSF" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="bg-gradient-to-r from-purple-100 to-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">ENGAGEMENT LETTER</h2>
        <p className="text-gray-700 mb-2">FOR SOLE TRADER | COMPANY | TRUST | PARTNERSHIP | SMSF</p>
        <p className="text-sm text-gray-600">
          Please thoroughly read, fill out and then sign the last page of this letter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="agreementDate">
            Today's Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            id="agreementDate"
            name="agreementDate"
            value={engagementData.agreementDate || ""}
            onChange={handleChange}
            className={errors.agreementDate ? "border-red-500" : ""}
            required
          />
          {errors.agreementDate && <p className="text-red-500 text-sm mt-1">{errors.agreementDate}</p>}
        </div>

        <div>
          <Label htmlFor="entityType">
            Entity Structure <span className="text-red-500">*</span>
          </Label>
          <select
            id="entityType"
            name="entityType"
            value={engagementData.entityType || ""}
            onChange={e => handleSelectChange("entityType", e.target.value)}
            className={`w-full border rounded px-3 py-2 ${errors.entityType ? "border-red-500" : "border-gray-300"}`}
            required
          >
            <option value="">Select entity type</option>
            {entityTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.entityType && <p className="text-red-500 text-sm mt-1">{errors.entityType}</p>}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">
            Address <span className="text-red-500">*</span>
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="streetAddress">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                value={engagementData.streetAddress || ""}
                onChange={handleChange}
                className={errors.streetAddress ? "border-red-500" : ""}
                required
              />
              {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
            </div>

            <div>
              <Label htmlFor="streetAddress2">Street Address Line 2</Label>
              <Input
                id="streetAddress2"
                name="streetAddress2"
                value={engagementData.streetAddress2 || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suburb">
                  Suburb <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="suburb"
                  name="suburb"
                  value={engagementData.suburb || ""}
                  onChange={handleChange}
                  className={errors.suburb ? "border-red-500" : ""}
                  required
                />
                {errors.suburb && <p className="text-red-500 text-sm mt-1">{errors.suburb}</p>}
              </div>

              <div>
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <select
                  id="state"
                  name="state"
                  value={engagementData.state || ""}
                  onChange={e => handleSelectChange("state", e.target.value)}
                  className={`w-full border rounded px-3 py-2 ${errors.state ? "border-red-500" : "border-gray-300"}`}
                  required
                >
                  <option value="">Select state</option>
                  {stateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="postcode">
                Postcode <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postcode"
                name="postcode"
                value={engagementData.postcode || ""}
                onChange={handleChange}
                className={errors.postcode ? "border-red-500" : ""}
                maxLength={4}
                required
              />
              {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6 overflow-y-auto max-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ENGAGEMENT LETTER – Income Tax Return, Financial Statements Preparation and other work
          </h3>

          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-4">
              As our newest client, we would like to officially welcome you to Accverse. The following outlines the services
              that we provide in our role and more importantly our understanding of your requirements from us.
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">1. PURPOSE AND SCOPE</h4>
            <p className="mb-4">
              This letter sets out the terms of the engagement where Accverse will provide accounting and taxation services
              to you. It details the accounting and taxation services that we will provide to you and our respective
              responsibilities.
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">2. SERVICES PROVIDED</h4>
            <p className="mb-4">We will provide the following services for the financial year ending 30 June:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Preparation and lodgment of Income Tax Return</li>
              <li>Preparation of Financial Statements (if applicable)</li>
              <li>Business Activity Statements (BAS) preparation and lodgment (if applicable)</li>
              <li>Tax planning and advisory services</li>
              <li>Other accounting and taxation services as agreed</li>
            </ul>

            <h4 className="font-semibold mt-6 text-gray-800">3. PERIOD OF ENGAGEMENT</h4>
            <p className="mb-4">
              This engagement will start upon acceptance of the terms of engagement by you and will continue until either
              party terminates the engagement or the services are completed. We will not deal with earlier periods unless
              you specifically ask us to do so and we agree.
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">4. RESPONSIBILITIES</h4>
            <p className="mb-4">
              <strong>Your Responsibilities:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                You are responsible for the reliability, accuracy and completeness of the accounting records, particulars
                and information provided.
              </li>
              <li>
                You are responsible for ensuring that reasonable care is exercised in preparing information to allow us to
                complete the agreed services.
              </li>
              <li>You are responsible for informing us of any material changes in your circumstances.</li>
              <li>
                You are responsible for the maintenance of adequate accounting records, an adequate internal control
                structure and the selection and application of appropriate accounting policies.
              </li>
            </ul>

            <p className="mb-4">
              <strong>Our Responsibilities:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>We will provide the services outlined in this letter with reasonable skill and care.</li>
              <li>
                We will lodge tax returns and other documents by the due dates, provided all necessary information is
                received in a timely manner.
              </li>
              <li>We will advise you of the adequacy of your record keeping systems for tax purposes.</li>
              <li>We will advise you of any material changes in tax legislation that may affect you.</li>
            </ul>

            <h4 className="font-semibold mt-6 text-gray-800">5. FEES</h4>
            <p className="mb-4">
              Our fees will be charged on the basis of the time and degree of skill required to complete the services,
              including any out-of-pocket expenses. Payment terms are strictly 14 days from the date of invoice.
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">6. CONFIDENTIALITY</h4>
            <p className="mb-4">
              We will maintain the confidentiality of all information provided to us and will not disclose any information
              to a third party without your consent, unless required by law.
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">7. OWNERSHIP OF DOCUMENTS</h4>
            <p className="mb-4">
              All original documents obtained from you arising from the engagement shall remain your property. However, we
              reserve the right to make a reasonable number of copies of the original documents for our records.
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">8. LIMITATION OF LIABILITY</h4>
            <p className="mb-4">
              Our liability is limited by a scheme approved under Professional Standards Legislation. Further information on
              the scheme is available from the Professional Standards Councils' website:{" "}
              <a href="https://www.psc.gov.au" className="text-blue-600 hover:underline">
                www.psc.gov.au
              </a>
              .
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">9. TERMINATION</h4>
            <p className="mb-4">
              Either party may terminate this engagement by giving 30 days written notice. In the event of termination, you
              will be invoiced for all work performed up to the date of termination.
            </p>

            <h4 className="font-semibold mt-6 text-gray-800">10. APPLICABLE LAW</h4>
            <p className="mb-4">
              This engagement shall be governed by, and construed in accordance with Australian law. The parties submit to
              the exclusive jurisdiction of the Australian Courts.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 my-6">
          <p className="text-sm text-yellow-800">
            This engagement letter contains the full terms and conditions of our services. By signing below, you
            acknowledge that you have read, understood, and agree to these terms.
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-bold text-lg mb-4">CLIENT ACCEPTANCE OF ENGAGEMENT AND TERMS</h3>
        <p className="mb-4">
          I acknowledge that I have read the Engagement Letter and the attached Terms and Conditions and that they are
          in accordance with my understanding of the arrangements for our work.
        </p>

        <div className="mb-6">
          <Label htmlFor="clientName">
            Client Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="clientName"
            name="clientName"
            value={engagementData.clientName || ""}
            onChange={handleChange}
            className={errors.clientName ? "border-red-500" : ""}
            required
          />
          {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
        </div>

        <div className="mb-6">
          <Label htmlFor="signature">
            Signature of Owner / Director / Partner / Trustee / Manager <span className="text-red-500">*</span>
          </Label>
          <SignatureField
            id="signature"
            value={engagementData.signature || ""}
            onChange={handleSignatureChange}
            required
          />
          {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature}</p>}
        </div>

        <div className="flex items-start space-x-2 mt-6">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          />
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none ml-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and accept the terms and conditions <span className="text-red-500">*</span>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm mt-1 ml-6">{errors.terms}</p>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Accept & Continue
        </Button>
      </div>
    </form>
  )
}

export default EngagementLetterForm