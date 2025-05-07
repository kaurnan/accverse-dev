"use client"
import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./styles/select-fix.css" // Import the select fix CSS
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import TrainingPage from "./pages/TrainingPage"
import ContactPage from "./pages/ContactPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import { useEffect } from "react"
import BookingPage from "./pages/BookingPage"
import PricingPage from "./pages/PricingPage"
import VerificationPage from "./pages/VerificationPage"
import AppointmentsPage from "./pages/AppointmentsPage"
import { AuthProvider, useAuth } from "./components/AuthContext"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import CompleteRegistrationPage from "./pages/CompleteRegistrationPage"
import TaxSolutionsPage from "./pages/TaxSolutionsPage"
import TaxFormSelectPage from "./pages/TaxFormSelectPage"
import BusinessTaxFormPage from "./pages/BusinessTaxFormPage"
import SMSFTaxFormPage from "./pages/SMSFTaxFormPage"
import EngagementLetterPage from "./pages/EngagementLetterPage"
import SMSFEstablishmentPage from "./pages/SMSFEstablishmentPage"
import CompanyRegistrationPage from "./pages/CompanyRegistrationPage"
import SMSFPaymentPage from "./pages/SMSFPaymentPage"
import BusinessPaymentPage from "./pages/BusinessPaymentPage"
import IndividualPaymentPage from "./pages/IndividualPaymentPage"
import SoleTraderPaymentPage from "./pages/SoleTraderPaymentPage"
import SMSFEstablishmentPaymentPage from "./pages/SMSFEstablishmentPaymentPage"
import CompanyRegistrationPaymentPage from "./pages/CompanyRegistrationPaymentPage"
import AccountingServicesPage from "./pages/AccountingServicesPage"

import { resetAllWidgets } from "./utils/recaptcha-manager"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Tax Solutions Routes */}
      <Route path="/tax-forms" element={<TaxFormSelectPage />} />
      {/* <Route path="/tax-solutions" element={<TaxSolutionsPage />} />
      <Route path="/tax-solutions/business" element={<BusinessTaxFormPage />} />
      <Route path="/tax-solutions/company-registration" element={<CompanyRegistrationPage />} /> */}

      <Route path="/tax-solutions" element={
        <ProtectedRoute>
          <TaxSolutionsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/tax-solutions/business" element={
        <ProtectedRoute>
          <BusinessTaxFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/tax-solutions/smsf" element={
        <ProtectedRoute>
          <SMSFTaxFormPage />
          </ProtectedRoute>
      } />
      
      {/* <Route path="/tax-solutions/individual/payment" element={ */}
      <Route path="/payment/individual" element={ 
        <ProtectedRoute>
          <IndividualPaymentPage />
        </ProtectedRoute>
      } />
      <Route path="/payment/sole-trader" element={ 
        <ProtectedRoute>
          <SoleTraderPaymentPage />
        </ProtectedRoute>
      } />

      <Route path="/tax-solutions/smsf/payment" element={
        <ProtectedRoute>
           <SMSFPaymentPage />
        </ProtectedRoute>
      } />

      {/* Add the business payment route */}
      <Route path="/tax-solutions/business/payment" element={
        <ProtectedRoute>
          <BusinessPaymentPage />
        </ProtectedRoute>
      } />
      
      <Route path="/tax-solutions/engagement" element={
        <ProtectedRoute>
          <EngagementLetterPage />
        </ProtectedRoute>
      } />
      
      <Route path="/tax-solutions/smsf-establishment" element={
        <ProtectedRoute>
          <SMSFEstablishmentPage />
        </ProtectedRoute>
      } />
      
      <Route path="/tax-solutions/company-registration" element={
        <ProtectedRoute>
          <CompanyRegistrationPage />
        </ProtectedRoute>
      } />

      {/* Protected routes */}
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/smsf-establishment-payment" element={
        <ProtectedRoute>
          <SMSFEstablishmentPaymentPage />
        </ProtectedRoute>
      } />

      <Route path="/company-registration-payment" element={
        <ProtectedRoute>
          <CompanyRegistrationPaymentPage />
        </ProtectedRoute>
      } />

      <Route path="/accounting-services" element={
        <ProtectedRoute>
          <AccountingServicesPage />
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Add this component to handle route changes
const RouteChangeHandler = () => {
  const location = useLocation()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined

    const resetCaptcha = () => {
      if (typeof window !== "undefined" && window.grecaptcha) {
        try {
          // Wait for grecaptcha to be ready
          if (window.grecaptcha.ready) {
            window.grecaptcha.ready(() => {
              resetAllWidgets()
            })
          } else {
            resetAllWidgets()
          }
        } catch (error) {
          console.error("Error resetting reCAPTCHA widgets on route change:", error)
        }
      }
    }

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set a new timeout with a longer delay
    timeoutId = setTimeout(resetCaptcha, 1000)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [location])

  return null
}

// In the Router component, add the RouteChangeHandler
function App() {
  return (
    <Router>
      <AuthProvider>
        <RouteChangeHandler />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={5000} theme="light" />
      </AuthProvider>
    </Router>
  )
}

export default App