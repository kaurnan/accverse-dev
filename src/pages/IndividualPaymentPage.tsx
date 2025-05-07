"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { CheckCircle, CreditCard, Shield, ArrowLeft } from "lucide-react"
import { useToast } from "../components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import apiClient from "../services/api"

interface AddOnService {
  id: string
  name: string
  description: string
  price: number
  selected: boolean
}

const IndividualPaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [formData, setFormData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [individualType, setIndividualType] = useState<"student" | "employee">("student")
  const [addOns, setAddOns] = useState<AddOnService[]>([
    {
      id: "investment-property",
      name: "Investment Property",
      description: "$55 per investment property",
      price: 55,
      selected: false,
    },
    {
      id: "capital-gains",
      name: "Capital Gains (without DPR)",
      description: "$33 per trade",
      price: 33,
      selected: false,
    },
    {
      id: "capital-gains-dpr",
      name: "Capital Gains (with DPR)",
      description: "$44 per trade",
      price: 44,
      selected: false,
    },
  ])

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData)
      console.log("Received form data:", location.state.formData)
    } else {
      toast({
        title: "No form data found",
        description: "Please complete the tax form first.",
        variant: "destructive",
      })
      navigate("/tax-forms")
    }
  }, [location.state, toast, navigate])

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const getBasePrice = () => {
    return individualType === "student" ? 65 : 110
  }

  const getPlanFeatures = () => {
    return ["Prepare & File Tax Return", "Annual Tax Assessment Review", "Basic Tax Planning Advice"]
  }

  const calculateTotal = () => {
    const basePrice = getBasePrice()
    const addOnsTotal = addOns.reduce((sum, addon) => (addon.selected ? sum + addon.price : sum), 0)
    return basePrice + addOnsTotal
  }

  const handlePayment = async () => {
    if (!formData) return
    setIsSubmitting(true)

    const paymentInfo = {
      taxpayerType: "individual",
      plan: individualType,
      basePrice: getBasePrice(),
      selectedAddOns: addOns.filter((addon) => addon.selected),
      totalAmount: calculateTotal(),
      paymentStatus: "completed",
      paymentDate: new Date().toISOString(),
    }

    const finalSubmission = {
      ...formData,
      payment: paymentInfo,
    }

    try {
      const res = await apiClient.post("/tax-solutions/individual-complete-submission", finalSubmission)

      if (res.status === 200) {
        toast({
          title: "Payment successful!",
          description: "Your tax form has been submitted.",
          variant: "default",
        })
        navigate("/tax-forms", {
          state: {
            submissionComplete: true,
            message: "Your tax form and payment have been processed successfully.",
          },
        })
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container my-12 max-w-5xl mx-auto px-4">
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2 border-purple-200 hover:bg-purple-50"
        onClick={() => navigate("/tax-forms")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tax Form
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Individual Tax Service
        </h1>
        <p className="text-gray-600 text-lg">Choose your plan and any additional services you require</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select a Plan</h2>
        <RadioGroup
          value={individualType}
          onValueChange={(value) => setIndividualType(value as "student" | "employee")}
          className="grid grid-cols-2 gap-4"
        >
          <div
            className={`border rounded-lg p-6 cursor-pointer ${
              individualType === "student" ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
          >
            <RadioGroupItem value="student" id="student" className="sr-only" />
            <Label htmlFor="student">
              <div className="font-bold text-xl mb-2">Students under 21</div>
              <div className="text-3xl font-bold mb-2">$65</div>
              <div className="text-gray-600 mb-4">Per Return</div>
              <div className="text-sm text-gray-600 mb-2">The fee includes:</div>
              <ul className="space-y-2">
                {getPlanFeatures().map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Label>
          </div>

          <div
            className={`border rounded-lg p-6 cursor-pointer ${
              individualType === "employee" ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
          >
            <RadioGroupItem value="employee" id="employee" className="sr-only" />
            <Label htmlFor="employee">
              <div className="font-bold text-xl mb-2">Full Time Employee</div>
              <div className="text-3xl font-bold mb-2">$110</div>
              <div className="text-gray-600 mb-4">Per Return</div>
              <div className="text-sm text-gray-600 mb-2">The fee includes:</div>
              <ul className="space-y-2">
                {getPlanFeatures().map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Additional Services</h2>
        <p className="text-gray-600 mb-4">Select any additional services you need with your chosen plan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addOns.map((addon) => (
            <div
              key={addon.id}
              className={`border rounded-lg p-4 cursor-pointer ${
                addon.selected ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
              onClick={() =>
                setAddOns((prev) => prev.map((a) => (a.id === addon.id ? { ...a, selected: !a.selected } : a)))
              }
            >
              <div className="flex items-center">
                <Checkbox checked={addon.selected} onCheckedChange={() => {}} className="mr-3" />
                <div className="flex-1">
                  <h3 className="font-medium">{addon.name}</h3>
                  <p className="text-sm text-gray-600">{addon.description}</p>
                </div>
                <div className="font-bold">${addon.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">Total</h3>
            <p className="text-gray-600">
              Selected plan: {individualType === "student" ? "Students under 21" : "Full Time Employee"} ($
              {getBasePrice()}) with add-ons
            </p>
          </div>
          <div className="text-3xl font-bold">${calculateTotal()}</div>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            Your payment is secure. We use industry-standard encryption to protect your information.
          </div>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 flex items-center justify-center gap-2"
          onClick={handlePayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-1" />
              Complete Payment
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default IndividualPaymentPage
