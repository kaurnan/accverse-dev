"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { CheckCircle, CreditCard, Shield, ArrowLeft } from "lucide-react"
import { useToast } from "../components/ui/use-toast"
import { Checkbox } from "../components/ui/checkbox"
import apiClient from "../services/api"

interface AddOnService {
  id: string
  name: string
  description: string
  price: number
  selected: boolean
}

const SoleTraderPaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [formData, setFormData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"basOnly" | "taxReturn" | "complete">("taxReturn")
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
    window.scrollTo(0, 0)
    if (location.state?.formData) {
      setFormData(location.state.formData)
      if (location.state.formData.plan) {
        setSelectedPlan(location.state.formData.plan)
      }
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

  const getBasePrice = () => {
    switch (selectedPlan) {
      case "basOnly":
        return 250
      case "taxReturn":
        return 550
      case "complete":
        return 300
      default:
        return 0
    }
  }

  const getPlanFeatures = () => {
    switch (selectedPlan) {
      case "basOnly":
        return ["Prepare & File Quarterly BAS/IAS"]
      case "taxReturn":
        return [
          "Prepare & File Annual Tax Return",
          "Investment Property Processing ($55 per property)",
          "Capital Gains Processing",
        ]
      case "complete":
        return [
          "Bookkeeping",
          "Prepare & File Quarterly BAS/IAS",
          "Prepare & File Annual Tax Return",
          "Tax Administration",
          "ASIC Management",
        ]
      default:
        return []
    }
  }

  const getPlanPeriod = () => {
    switch (selectedPlan) {
      case "basOnly":
        return "Per Quarter"
      case "taxReturn":
        return "Per Return"
      case "complete":
        return "Per Month"
      default:
        return ""
    }
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
      taxpayerType: "soleTrader",
      plan: selectedPlan,
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
      const res = await apiClient.post("/tax-solutions/sole-trader-complete-submission", finalSubmission)

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
          Sole Trader Tax Service
        </h1>
        <p className="text-gray-600 text-lg">Choose your plan and any additional services you require</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Select a Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`border rounded-lg p-6 cursor-pointer ${
            selectedPlan === "basOnly" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => setSelectedPlan("basOnly")}
        >
          <div className="bg-gray-800 text-white font-bold text-xl mb-4 py-2 px-4 rounded-md text-center">
            Lodge BAS Only
          </div>
          <div className="text-3xl font-bold mb-2 text-center">$250</div>
          <div className="text-gray-600 mb-4 text-center">Per Quarter</div>
          <div className="text-sm text-gray-600 mb-2">The fee includes:</div>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Prepare & File Quarterly BAS/IAS</span>
            </li>
          </ul>
        </div>

        <div
          className={`border rounded-lg p-6 cursor-pointer ${
            selectedPlan === "taxReturn" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => setSelectedPlan("taxReturn")}
        >
          <div className="bg-gray-800 text-white font-bold text-xl mb-4 py-2 px-4 rounded-md text-center">
            Tax Return
          </div>
          <div className="text-3xl font-bold mb-2 text-center">$550</div>
          <div className="text-gray-600 mb-4 text-center">Per Return</div>
          <div className="text-sm text-gray-600 mb-2">The fee includes:</div>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Prepare & File Annual Tax Return</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Each Investment Property is $55 to be added</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Capital Gains to add from $33</span>
            </li>
          </ul>
        </div>

        <div
          className={`border rounded-lg p-6 cursor-pointer ${
            selectedPlan === "complete" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => setSelectedPlan("complete")}
        >
          <div className="bg-gray-800 text-white font-bold text-xl mb-4 py-2 px-4 rounded-md text-center">
            Complete Service
          </div>
          <div className="text-3xl font-bold mb-2 text-center">$300</div>
          <div className="text-gray-600 mb-4 text-center">Per Month</div>
          <div className="text-sm text-gray-600 mb-2">The fee includes:</div>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Bookkeeping</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Prepare & File Quarterly BAS/IAS</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Prepare & File Annual Tax Return</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">Tax Administration (Tax Assessments and reminders)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
              <span className="text-sm">ASIC Management</span>
            </li>
          </ul>
        </div>
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
              Selected plan:{" "}
              {selectedPlan === "basOnly"
                ? "Lodge BAS Only"
                : selectedPlan === "taxReturn"
                  ? "Tax Return"
                  : "Complete Service"}{" "}
              (${getBasePrice()}) {getPlanPeriod()} with add-ons
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

export default SoleTraderPaymentPage
