"use client"

import React from "react"
import { Label } from "../../ui/label"
import { SignatureCapture } from "../../ui/signature-capture"
import { Checkbox } from "../../ui/checkbox"
import { Link } from "react-router-dom"
import { FileText } from "lucide-react"
import { Button } from "../../ui/button"
import { useNavigate } from "react-router-dom"

interface FormStep5SMSFProps {
  formData: {
    signature: string | null | File
    declarationAccepted: string
    engagementLetter?: {
      accepted: boolean
      signature: string | null
      dateSigned: string | null
    }
    [key: string]: any
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleRadioChange?: (name: string, value: string) => void
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void
  errors: Record<string, string>
}

const FormStep5SMSF: React.FC<FormStep5SMSFProps> = ({
  formData,
  handleChange,
  handleRadioChange,
  handleFileChange,
  errors,
}) => {
  const navigate = useNavigate()

  const handleEngagementLetterClick = () => {
    navigate("/tax-solutions/engagement", {
      state: {
        smsfFormData: formData,
        currentStep: 5
      }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div id="engagement-letter-section" className="mb-8">
        {formData?.engagementLetter?.accepted ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <strong>Engagement Letter Completed</strong>
            </p>
            <p className="text-sm text-green-700 mt-2">
              Date signed: {new Date(formData.engagementLetter.dateSigned || '').toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Engagement Letter Required</h3>
                <p className="text-yellow-700 mb-4">
                  Before you can submit your form, you must complete and sign the engagement letter. This is a required step that outlines our terms of service and your responsibilities.
                </p>
                <div className="space-y-2 text-yellow-700">
                  <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Review the terms and conditions
                  </p>
                  <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Sign the document electronically
                  </p>
                  <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Accept the terms to proceed
                  </p>
                </div>
                <Button
                  onClick={handleEngagementLetterClick}
                  className="mt-4 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Complete Engagement Letter Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Declaration</h3>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>
              You hereby appoint Accverse (Tax Agent Reg. No 26274335) to act as your SMSF accountant &/or tax agent.
            </strong>{" "}
            We will add you to our tax agent portal and liaise with the ATO on your behalf as required.
          </p>
          <p>
            You declare that all the information you have provided to us are correct and complete to the best of your
            knowledge.
          </p>
          <p>
            As Trustee of the Fund, you understand your obligations under self assessment to keep full and proper
            records for minimum 5 years.
          </p>
          <p>
            <strong>Internet Transfer:</strong> You understand that once you transfer our SMSF accounting and tax fees
            into our bank account, your tax return will be lodged with the ATO and any refund due will be deposited
            directly into your nominated bank account by the ATO.
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="declarationAccepted"
              checked={formData.declarationAccepted === "yes"}
              onCheckedChange={(checked) => {
                if (handleRadioChange) {
                  handleRadioChange("declarationAccepted", checked ? "yes" : "no")
                }
              }}
            />
            <Label htmlFor="declarationAccepted" className="text-sm text-gray-700">
              I accept the above declaration
            </Label>
          </div>
          {errors.declarationAccepted && (
            <p className="text-red-500 text-sm mt-1">{errors.declarationAccepted}</p>
          )}
        </div>

        <div className="mt-6">
          <Label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
            Signature <span className="text-red-500">*</span>
          </Label>
          <SignatureCapture
            value={formData.signature}
            onChange={(value) => {
              if (handleFileChange) {
                const event = {
                  target: {
                    name: "signature",
                    value: value,
                  },
                } as React.ChangeEvent<HTMLInputElement>
                handleChange(event)
              }
            }}
            error={errors.signature}
          />
          {errors.signature && (
            <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormStep5SMSF