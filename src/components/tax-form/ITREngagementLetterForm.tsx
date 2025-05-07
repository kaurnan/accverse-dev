"use client"

import React, { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { SignatureField } from "../ui/signature-field"
import { ITRLetterData } from "@/types/form-types"

interface ITREngagementLetterFormProps {
  onComplete: (data?: ITRLetterData) => void
  formData: any
  itrEngagementLetter: ITRLetterData | null
  setITREngagementLetter: React.Dispatch<React.SetStateAction<ITRLetterData | null>>
}

const ITREngagementLetterForm: React.FC<ITREngagementLetterFormProps> = ({
  onComplete,
  formData,
  itrEngagementLetter,
  setITREngagementLetter,
}) => {
  const currentDate = new Date().toISOString().split("T")[0]
  const currentYear = new Date().getFullYear()

  const [itrEngagementData, setITREngagementData] = useState<ITRLetterData>({
    clientName: "",
    signature: "",
    accepted: false,
    dateSigned: null,
    signDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<{ clientName?: string; signature?: string; signDate?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setITREngagementData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignatureChange = (value: string) => {
    setITREngagementData((prev) => ({
      ...prev,
      signature: value,
    }))
  }

  const validateForm = () => {
    const newErrors: { clientName?: string; signature?: string; signDate?: string } = {};
    if (!itrEngagementData.clientName || itrEngagementData.clientName.trim() === "") {
      newErrors.clientName = "Full Name is required";
    }
    if (!itrEngagementData.signature || itrEngagementData.signature.trim() === "") {
      newErrors.signature = "Signature is required";
    }
    if (!itrEngagementData.signDate || itrEngagementData.signDate.trim() === "") {
      newErrors.signDate = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const completedData = {
      ...itrEngagementData,
      accepted: true,
      dateSigned: new Date().toISOString(),
    };
    setITREngagementLetter(completedData);
    onComplete(completedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="bg-gradient-to-r from-purple-100 to-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">ITR ENGAGEMENT LETTER</h2>
        <p className="text-gray-700 mb-2">Income Tax Return Engagement Letter</p>
        <p className="text-sm text-gray-600">(Only for Individual Tax Return)</p>
      </div>

      <div className="prose max-w-none text-gray-700">
        <p className="mb-4">
          Thank you for instructions on {currentDate}. I am pleased to accept an appointment as your tax agent for 
          your {currentYear} tax return.
        </p>

        <p className="mb-4">
          This letter and the enclosed Standard Terms and Conditions set out our terms of the engagement. 
          Any additions will be by written agreement of both parties. Please read this letter and the Standard 
          Terms and Conditions carefully. If the terms are acceptable to you, please sign and return this letter 
          to us. If you do not return a signed copy of this letter, but continue to provide us with information 
          and instructions, we will assume that you have accepted the terms contained in this letter.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-medium mb-2">Scope of Services</h3>
          <p>As your tax agent I will prepare and lodge your individual income tax return for {currentYear} ("the Services").</p>
          <p className="text-sm text-gray-600">In performing the Services I will not review the accuracy of any previous tax returns lodged by you or by a previous tax agent.</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-medium mb-2">Fee and Billing Arrangements</h3>
          <p>Fees for the Services will be invoiced and are payable within 10 business days and prior to lodgment of your income tax return.</p>
        </div>

        <div className="mt-8">
          <p className="mb-4">Yours faithfully,</p>
          <p className="font-medium">Prasoon Veerath</p>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="font-bold mb-4">Acknowledgement and Confirmation</h3>
          <p className="mb-4">I hereby acknowledge and accept the terms of this engagement and agree to be liable for all fees for services performed in accordance with this agreement.</p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="clientName"
                name="clientName"
                value={itrEngagementData.clientName || ""}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={errors.clientName ? "border-red-500" : ""}
              />
              {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
            </div>

            <div>
              <Label>Signature <span className="text-red-500">*</span></Label>
              <SignatureField
                id="itrSignature"
                value={itrEngagementData.signature || ""}
                onChange={handleSignatureChange}
                required
              />
              {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature}</p>}
            </div>

            <div>
              <Label htmlFor="signDate">Date <span className="text-red-500">*</span></Label>
              <Input
                id="signDate"
                name="signDate"
                type="date"
                value={itrEngagementData.signDate || currentDate}
                onChange={handleChange}
                required
                className={errors.signDate ? "border-red-500" : ""}
              />
              {errors.signDate && <p className="text-red-500 text-sm mt-1">{errors.signDate}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit">Accept & Continue</Button>
      </div>
    </form>
  )
}

export default ITREngagementLetterForm
