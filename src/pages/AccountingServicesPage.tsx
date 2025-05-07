import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, BarChart4, CheckCircle, FileText, Calculator } from "lucide-react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"

const AccountingServicesPage = () => {
  const serviceFeatures = {
    bookkeeping: [
      "Comprehensive financial bookkeeping",
      "Payroll and administrative services",
      "Smart solutions for secure and efficient book management",
      "Seamless integration with your business systems",
      "Experienced team of bookkeeping veterans",
      "Free your time to focus on core business activities"
    ],
    vcfo: [
      "Customized VCFO services for your business needs",
      "Short-term and long-term financial strategy",
      "Full spectrum of financial management services",
      "Bridge the gap between accounting and management",
      "Meaningful insights to evaluate performance",
      "Sustainable business growth planning"
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Accounting Solutions</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Professional financial services tailored to your business needs
            </p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Accounting Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide a comprehensive suite of accounting solutions to help your business succeed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Bookkeeping Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calculator className="h-8 w-8 text-blue-700" />
                </div>
                <span className="text-sm font-semibold text-blue-700 bg-blue-100 py-1 px-3 rounded-full">
                  For Businesses
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Bookkeeping and Payroll</h2>
              <p className="text-gray-600 text-lg">Comprehensive financial management solutions</p>
            </div>

            <div className="p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                We provide comprehensive financial bookkeeping, payroll and administrative services for Businesses.
                Our Smart bookkeeping solutions have been a viable option for many in managing books securely
                and efficiently, yielding them more time to focus on consulting and advisory activities. Our team of
                bookkeeping veterans will closely work with you to understand your business requirements, formulate
                seamless integration and maintain tailor made bookkeeping solutions freeing you from investing on
                human capital for maintaining books.
              </p>

              <ul className="space-y-3 mb-8">
                {serviceFeatures.bookkeeping.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/tax-solutions/business?formType=accounting" className="w-full block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 flex items-center justify-center group">
                  Learn More About Bookkeeping
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* VCFO Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart4 className="h-8 w-8 text-purple-700" />
                </div>
                <span className="text-sm font-semibold text-purple-700 bg-purple-100 py-1 px-3 rounded-full">
                  Strategic Support
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">VCFO Services</h2>
              <p className="text-gray-600 text-lg">Virtual CFO solutions for business growth</p>
            </div>

            <div className="p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                We understand the unique needs of your Business and provide customized VCFO services that meet
                your short term and long term needs. With the right mix of skills, technology and experience we provide
                a full spectrum of VCFO services bridging the gap between accounting and management. Meaningful
                insights enable business owners to evaluate performance outcomes and grow the business
                sustainably.
              </p>

              <ul className="space-y-5 mb-11">
                {serviceFeatures.vcfo.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/tax-solutions/business?formType=accounting" className="w-full block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 flex items-center justify-center group">
                  Get Started with VCFO Services
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Financial Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our complete range of financial and accounting solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-t-4 border-blue-500 hover:-translate-y-1 transform">
              <div className="mb-4 bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tax Planning & Compliance</h3>
              <p className="text-gray-600 mb-4">
                Strategic tax planning and compliance services to optimize your tax position and ensure adherence to regulations.
              </p>
              <Link 
                to="/tax-forms" 
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center group"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-t-4 border-green-500 hover:-translate-y-1 transform">
              <div className="mb-4 bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Financial Reporting</h3>
              <p className="text-gray-600 mb-4">
                Accurate and insightful financial reports to help you understand your business performance and make informed decisions.
              </p>
              <Link 
                to="/tax-solutions/business?formType=accounting" 
                className="text-green-600 font-medium hover:text-green-800 flex items-center group"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-t-4 border-purple-500 hover:-translate-y-1 transform">
              <div className="mb-4 bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                <BarChart4 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Business Advisory</h3>
              <p className="text-gray-600 mb-4">
                Expert business advice and strategic guidance to help your business thrive and achieve sustainable growth.
              </p>
              <Link 
                to="/tax-solutions/business?formType=accounting" 
                className="text-purple-600 font-medium hover:text-purple-800 flex items-center group"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Financial Management?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
            Schedule a consultation with our expert team to discuss your specific accounting needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/booking"
              className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors inline-block"
            >
              Book a Consultation
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountingServicesPage
