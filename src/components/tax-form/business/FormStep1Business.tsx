"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { Info } from "lucide-react"

interface FormStep1Props {
  formData: {
    taxLodgement: string
    entityType: string
    entityName: string
    abn: string
    acn: string
    tfn: string
    contactName: string
    contactEmail: string
    contactPhone: string
    contactMobile: string
    contactPosition: string
    streetAddress: string
    streetAddress2: string
    city: string
    state: string
    postcode: string
    gstRegistered: string
    asicAgent: string
    [key: string]: string | File | null
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleRadioChange: (name: string, value: string) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void
  errors?: Record<string, string>
}

const FormStep1Business: React.FC<FormStep1Props> = ({
  formData,
  handleChange,
  handleRadioChange,
  handleFileChange,
  errors = {},
}) => {
  const [showTfn, setShowTfn] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="bg-purple-600 text-white p-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
        <h2 className="text-xl font-semibold">Part 1: Business Details</h2>
      </div>

      <div className="space-y-6">
        {/* Tax Lodgement Service */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <Label htmlFor="taxLodgement" className="block text-gray-700 font-medium mb-2">
            Do you require tax lodgement services? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.taxLodgement}
            onValueChange={(value) => handleRadioChange("taxLodgement", value)}
            className="flex flex-row space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="taxLodgementYes" />
              <Label htmlFor="taxLodgementYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="taxLodgementNo" />
              <Label htmlFor="taxLodgementNo">No</Label>
            </div>
          </RadioGroup>
          {errors.taxLodgement && <p className="mt-1 text-sm text-red-500">{errors.taxLodgement}</p>}
        </div>

        {/* Entity Type */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <Label htmlFor="entityType" className="block text-gray-700 font-medium mb-2">
            Entity Type
          </Label>
          <RadioGroup
            value={formData.entityType}
            onValueChange={(value) => handleRadioChange("entityType", value)}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="company" />
              <Label htmlFor="company">Company</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trust" id="trust" />
              <Label htmlFor="trust">Trust</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="smsf" id="smsf" />
              <Label htmlFor="smsf">SMSF</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partnership" id="partnership" />
              <Label htmlFor="partnership">Partnership</Label>
            </div>
          </RadioGroup>
          {errors.entityType && <p className="mt-1 text-sm text-red-500">{errors.entityType}</p>}
        </div>

        {/* Entity Name */}
        <div className="form-group">
          <Label htmlFor="entityName" className="block text-gray-700 font-medium mb-2">
            Entity Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="entityName"
            name="entityName"
            value={formData.entityName}
            onChange={handleChange}
            className={`w-full border ${errors.entityName ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
            required
            placeholder="Enter your business entity name"
          />
          {errors.entityName && <p className="mt-1 text-xs text-red-500">{errors.entityName}</p>}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">Business Registration Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ABN */}
            <div className="form-group">
              <Label htmlFor="abn" className="flex items-center text-gray-700 font-medium mb-2">
                Australian Business Number (ABN)
                <div className="group relative ml-2">
                  <button type="button" className="text-blue-500" aria-label="ABN information">
                    <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    ABN is a unique 11-digit identifier issued by the Australian Business Register.
                  </div>
                </div>
              </Label>
              <Input
                id="abn"
                name="abn"
                value={formData.abn}
                onChange={handleChange}
                error={errors.abn}
                placeholder="e.g., 12345678901"
              />
            </div>

            {/* ACN */}
            <div className="form-group">
              <Label htmlFor="acn" className="flex items-center text-gray-700 font-medium mb-2">
                Australian Company Number (ACN)
                <div className="group relative ml-2">
                  <button type="button" className="text-blue-500" aria-label="ACN information">
                    <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    ACN is a nine-digit number issued by ASIC to identify companies.
                  </div>
                </div>
              </Label>
              <Input
                id="acn"
                name="acn"
                value={formData.acn}
                onChange={handleChange}
                error={errors.acn}
                placeholder="e.g., 123456789"
              />
            </div>
          </div>

          {/* TFN */}
          <div className="form-group mt-6">
            <Label htmlFor="tfn" className="flex items-center text-gray-700 font-medium mb-2">
              Tax File Number (TFN)
              <div className="group relative ml-2">
                <button type="button" className="text-blue-500" aria-label="TFN information">
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Tax File Number (TFN) is an identification number issued by the Australian Taxation Office (ATO).
                </div>
              </div>
            </Label>
            <Input
              id="tfn"
              name="tfn"
              value={formData.tfn}
              onChange={handleChange}
              error={errors.tfn}
              isPassword={true}
              isPasswordVisible={showTfn}
              togglePasswordVisibility={() => setShowTfn(!showTfn)}
            />
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">Contact Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Name */}
            <div className="form-group">
              <Label htmlFor="contactName" className="flex items-center text-gray-700 font-medium mb-2">
                Contact Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                error={errors.contactName}
                required
              />
            </div>

            {/* Contact Position */}
            <div className="form-group">
              <Label htmlFor="contactPosition" className="block text-gray-700 font-medium mb-2">
                Position in Business
              </Label>
              <Input
                id="contactPosition"
                name="contactPosition"
                value={formData.contactPosition}
                onChange={handleChange}
                error={errors.contactPosition}
                placeholder="e.g., Director, Manager"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Contact Email */}
            <div className="form-group">
              <Label htmlFor="contactEmail" className="flex items-center text-gray-700 font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                error={errors.contactEmail}
                required
              />
            </div>

            {/* Contact Mobile */}
            <div className="form-group">
              <Label htmlFor="contactMobile" className="flex items-center text-gray-700 font-medium mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactMobile"
                name="contactMobile"
                value={formData.contactMobile}
                onChange={handleChange}
                error={errors.contactMobile}
                required
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div className="form-group mt-4">
            <Label htmlFor="contactPhone" className="block text-gray-700 font-medium mb-2">
              Business Phone Number
            </Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              error={errors.contactPhone}
            />
          </div>
        </div>

        {/* Business Address Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">Business Address</h3>

          {/* Street Address */}
          <div className="form-group mb-4">
            <Label htmlFor="streetAddress" className="flex items-center text-gray-700 font-medium mb-2">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              error={errors.streetAddress}
              required
            />
          </div>

          {/* Street Address 2 */}
          <div className="form-group mb-4">
            <Label htmlFor="streetAddress2" className="block text-gray-700 font-medium mb-2">
              Address Line 2
            </Label>
            <Input
              id="streetAddress2"
              name="streetAddress2"
              value={formData.streetAddress2}
              onChange={handleChange}
              error={errors.streetAddress2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div className="form-group">
              <Label htmlFor="city" className="flex items-center text-gray-700 font-medium mb-2">
                City/Suburb <span className="text-red-500">*</span>
              </Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} error={errors.city} required />
            </div>

            {/* State */}
            <div className="form-group">
              <Label htmlFor="state" className="flex items-center text-gray-700 font-medium mb-2">
                State <span className="text-red-500">*</span>
              </Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              >
                <option value="">Select a state</option>
                <option value="ACT">Australian Capital Territory</option>
                <option value="NSW">New South Wales</option>
                <option value="NT">Northern Territory</option>
                <option value="QLD">Queensland</option>
                <option value="SA">South Australia</option>
                <option value="TAS">Tasmania</option>
                <option value="VIC">Victoria</option>
                <option value="WA">Western Australia</option>
              </select>
              {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
            </div>

            {/* Postcode */}
            <div className="form-group">
              <Label htmlFor="postcode" className="flex items-center text-gray-700 font-medium mb-2">
                Postcode <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                error={errors.postcode}
                required
              />
            </div>
          </div>
        </div>

        {/* GST Registration */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mt-6">
          <Label htmlFor="gstRegistered" className="flex items-center text-gray-700 font-medium mb-2">
            Is the business registered for GST?
            <div className="group relative ml-2">
              <button type="button" className="text-blue-500" aria-label="GST information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Goods and Services Tax (GST) is a tax of 10% on most goods and services sold in Australia.
              </div>
            </div>
          </Label>
          <RadioGroup
            value={formData.gstRegistered}
            onValueChange={(value) => handleRadioChange("gstRegistered", value)}
            className="flex flex-row space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="gstRegisteredYes" />
              <Label htmlFor="gstRegisteredYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="gstRegisteredNo" />
              <Label htmlFor="gstRegisteredNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* ASIC Agent */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <Label htmlFor="asicAgent" className="flex items-center text-gray-700 font-medium mb-2">
            Do you want us to be your ASIC agent?
            <div className="group relative ml-2">
              <button type="button" className="text-blue-500" aria-label="ASIC agent information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                ASIC (Australian Securities and Investments Commission) agents assist with company registrations,
                changes, and compliance.
              </div>
            </div>
          </Label>
          <RadioGroup
            value={formData.asicAgent}
            onValueChange={(value) => handleRadioChange("asicAgent", value)}
            className="flex flex-row space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="asicAgentYes" />
              <Label htmlFor="asicAgentYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="asicAgentNo" />
              <Label htmlFor="asicAgentNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

export default FormStep1Business
