"use client"

import type React from "react"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { FileUpload } from "../ui/file-upload"
import { Info } from "lucide-react"

interface FormStep2Props {
  formData: any
  handleRadioChange: (name: string, value: string) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void
  handleFileDelete?: (fieldName: string) => void
  errors: Record<string, string>
}

const FormStep2: React.FC<FormStep2Props> = ({
  formData,
  handleRadioChange,
  handleFileChange,
  handleFileDelete,
  errors,
}) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
          Part 2: Tax Residency & Offsets
        </h2>
        <p className="text-gray-600 mt-1">
          Provide details of Medicare, Private Health Insurance, Spouse, Dependents, if applicable.
        </p>
      </div>

      <div className="space-y-6">
        <div className="form-group" data-field="citizenStatus">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">
              Australian Citizen / Permanent Resident for Immigration Purposes? <span className="text-red-500">*</span>
            </Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Residency information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                <p>Select your residency status for this specific financial year ending 30 June.</p>
              </div>
            </div>
          </div>
          <RadioGroup
            value={formData.citizenStatus || ""}
            onValueChange={(value: string) => handleRadioChange("citizenStatus", value)}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="yesDuringYear" id="yesDuringYear" />
              <Label htmlFor="yesDuringYear" className="cursor-pointer">
                YES: in Australia during the financial year
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="yesReturned" id="yesReturned" />
              <Label htmlFor="yesReturned" className="cursor-pointer">
                YES: returned during the financial year from working abroad
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="noArrived" id="noArrived" />
              <Label htmlFor="noArrived" className="cursor-pointer">
                NO: arrived in Australia during the financial year
              </Label>
            </div>
          </RadioGroup>
          {errors.citizenStatus && <p className="mt-1 text-xs text-red-500">{errors.citizenStatus}</p>}
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-3 text-blue-700">TAX OFFSETS</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide the information below so we can calculate your tax offsets to reduce your liability.
          </p>

          <div className="space-y-5">
            <div className="form-group" data-field="spouse">
              <div className="flex items-center mb-2">
                <Label className="block text-gray-700 font-medium">
                  Have a Spouse during the FY? <span className="text-red-500">*</span>
                </Label>
                <div className="group relative ml-2 inline-block">
                  <button type="button" className="text-blue-500" aria-label="Spouse information">
                    <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    <p>Indicate if you had a husband, de-facto partner, or wife during the financial year.</p>
                  </div>
                </div>
              </div>
              <RadioGroup
                value={formData.spouse || ""}
                onValueChange={(value: string) => handleRadioChange("spouse", value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="yes" id="spouseYes" />
                  <Label htmlFor="spouseYes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="no" id="spouseNo" />
                  <Label htmlFor="spouseNo" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.spouse && <p className="mt-1 text-xs text-red-500">{errors.spouse}</p>}
            </div>

            <div className="form-group" data-field="dependents">
              <div className="flex items-center mb-2">
                <Label className="block text-gray-700 font-medium">
                  Did you have any Dependents during the Financial Year? <span className="text-red-500">*</span>
                </Label>
                <div className="group relative ml-2 inline-block">
                  <button type="button" className="text-blue-500" aria-label="Dependents information">
                    <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    <p>Dependents include children under 18 or others who rely on you financially.</p>
                  </div>
                </div>
              </div>
              <RadioGroup
                value={formData.dependents || ""}
                onValueChange={(value: string) => handleRadioChange("dependents", value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="yes" id="dependentsYes" />
                  <Label htmlFor="dependentsYes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="no" id="dependentsNo" />
                  <Label htmlFor="dependentsNo" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.dependents && <p className="mt-1 text-xs text-red-500">{errors.dependents}</p>}
            </div>

            <div className="form-group" data-field="medicare">
              <div className="flex items-center mb-2">
                <Label className="block text-gray-700 font-medium">
                  Have Medicare card? <span className="text-red-500">*</span>
                </Label>
                <div className="group relative ml-2 inline-block">
                  <button type="button" className="text-blue-500" aria-label="Medicare information">
                    <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    <p>Indicate if you have a Medicare card for healthcare services.</p>
                  </div>
                </div>
              </div>
              <RadioGroup
                value={formData.medicare || ""}
                onValueChange={(value: string) => handleRadioChange("medicare", value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="yes" id="medicareYes" />
                  <Label htmlFor="medicareYes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="no" id="medicareNo" />
                  <Label htmlFor="medicareNo" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.medicare && <p className="mt-1 text-xs text-red-500">{errors.medicare}</p>}
            </div>

            <div className="form-group" data-field="privateHealth">
              <div className="flex items-center mb-2">
                <Label className="block text-gray-700 font-medium">
                  Have Private Health Insurance? <span className="text-red-500">*</span>
                </Label>
                <div className="group relative ml-2 inline-block">
                  <button type="button" className="text-blue-500" aria-label="Private Health Insurance information">
                    <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    <p>If yes, you'll need to provide your Private Health Insurance statement.</p>
                  </div>
                </div>
              </div>
              <RadioGroup
                value={formData.privateHealth || ""}
                onValueChange={(value: string) => handleRadioChange("privateHealth", value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="yes" id="privateHealthYes" />
                  <Label htmlFor="privateHealthYes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="no" id="privateHealthNo" />
                  <Label htmlFor="privateHealthNo" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.privateHealth && <p className="mt-1 text-xs text-red-500">{errors.privateHealth}</p>}

              {formData.privateHealth === "yes" && (
                <div className="mt-3 ml-7" data-field="privateHealthFile">
                  <p className="text-sm text-gray-600 mb-2">
                    Please upload your Private Health Insurance Statement. This statement can be obtained via your
                    Insurer's website, phone, or email.
                  </p>
                  <FileUpload
                    id="privateHealthFile"
                    name="privateHealthFile"
                    value={formData.privateHealthFile}
                    onChange={(file) => handleFileDrop(file, "privateHealthFile")}
                    onDelete={handleFileDelete}
                    accept="application/pdf,image/jpeg,image/png"
                    tooltip="Upload your health insurance statement for proper tax calculation"
                    error={errors.privateHealthFile}
                    required={true}
                  />
                </div>
              )}
            </div>

            <div className="form-group" data-field="hecsDebt">
              <div className="flex items-center mb-2">
                <Label className="block text-gray-700 font-medium">
                  HECS/HELP Debt? <span className="text-red-500">*</span>
                </Label>
                <div className="group relative ml-2 inline-block">
                  <button type="button" className="text-blue-500" aria-label="HECS/HELP Debt information">
                    <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    <p>Indicate if you have an outstanding HECS/HELP student loan.</p>
                  </div>
                </div>
              </div>
              <RadioGroup
                value={formData.hecsDebt || ""}
                onValueChange={(value: string) => handleRadioChange("hecsDebt", value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="yes" id="hecsDebtYes" />
                  <Label htmlFor="hecsDebtYes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <RadioGroupItem value="no" id="hecsDebtNo" />
                  <Label htmlFor="hecsDebtNo" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.hecsDebt && <p className="mt-1 text-xs text-red-500">{errors.hecsDebt}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormStep2
