"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "./button"
import { Trash2, Edit3, Upload } from "lucide-react"
import { cn } from "../../lib/utils"

interface SignatureCaptureProps {
  id: string
  name: string
  value: string
  onChange: (value: string | null) => void
  label?: string
  required?: boolean
  error?: string
}

export const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  required = false,
  error,
}) => {
  const [mode, setMode] = useState<"draw" | "type" | "upload">("draw")
  const [typedSignature, setTypedSignature] = useState(value && !value.startsWith("data:image") ? value : "")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(!!value)

  // Initialize canvas and load existing signature if any
  useEffect(() => {
    if (mode !== "draw") return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Set up canvas styles
    context.lineWidth = 2
    context.lineCap = "round"
    context.strokeStyle = "#000"

    // Load existing signature if available
    if (value && value.startsWith("data:image")) {
      const img = new Image()
      img.onload = () => {
        if (context) {
          context.drawImage(img, 0, 0)
          setHasSignature(true)
        }
      }
      img.src = value
    }
  }, [value, mode])

  // Detect signature type and set mode accordingly
  useEffect(() => {
    if (value) {
      if (value.startsWith("data:image")) {
        setMode("draw")
      } else {
        setMode("type")
        setTypedSignature(value)
      }
    }
  }, [value])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    setIsDrawing(true)
    setHasSignature(true)

    // Get canvas position
    const rect = canvas.getBoundingClientRect()

    // Get coordinates
    let clientX, clientY
    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    // Start drawing
    context.beginPath()
    context.moveTo(clientX - rect.left, clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Get canvas position
    const rect = canvas.getBoundingClientRect()

    // Get coordinates
    let clientX, clientY
    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY

      // Prevent scrolling while drawing
      e.preventDefault()
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    // Draw line
    context.lineTo(clientX - rect.left, clientY - rect.top)
    context.stroke()
  }

  const endDrawing = () => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    context.closePath()
    setIsDrawing(false)

    // Save signature as data URL
    const signatureData = canvas.toDataURL("image/png")
    onChange(signatureData)
  }

  const clearSignature = () => {
    if (mode === "draw") {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext("2d")
      if (!context) return

      context.clearRect(0, 0, canvas.width, canvas.height)
    } else if (mode === "type") {
      setTypedSignature("")
    }

    setHasSignature(false)
    onChange(null)
  }

  const handleTypedSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedSignature(e.target.value)
    onChange(e.target.value)
    setHasSignature(!!e.target.value)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      onChange(result)
      setHasSignature(true)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full" data-field={name}>
      {label && (
        <div className="mb-2 font-medium text-sm flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          type="button"
          variant={mode === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("draw")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          Draw Signature
        </Button>
        <Button
          type="button"
          variant={mode === "type" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("type")}
        >
          <Edit3 className="h-4 w-4 mr-1" /> Type Signature
        </Button>
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("upload")
            setTimeout(() => fileInputRef.current?.click(), 0)
          }}
        >
          <Upload className="h-4 w-4 mr-1" /> Upload Signature
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
          aria-label="Upload signature image"
        />
      </div>

      <div
        className={cn("border-2 border-dashed rounded-lg p-2 transition-colors duration-200 ease-in-out", {
          "border-gray-300 bg-gray-50": !error,
          "border-red-500 bg-red-50": !!error,
          "error-highlight": !!error,
        })}
      >
        {mode === "draw" && (
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-[200px] bg-white rounded touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        )}

        {mode === "type" && (
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            <input
              type="text"
              id={id}
              name={`${name}-typed`}
              value={typedSignature}
              onChange={handleTypedSignatureChange}
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 bg-transparent"
              placeholder="Type your full name as signature"
              required={required && mode === "type"}
            />
            {typedSignature && (
              <div className="mt-4 flex justify-center">
                <p className="text-2xl font-serif italic">{typedSignature}</p>
              </div>
            )}
          </div>
        )}

        {mode === "upload" && value && value.startsWith("data:image") && (
          <div className="flex justify-center p-4 bg-white">
            <img src={value || "/placeholder.svg"} alt="Uploaded signature" className="max-h-32 object-contain" />
          </div>
        )}

        {mode === "upload" && (!value || !value.startsWith("data:image")) && (
          <div className="border border-gray-300 rounded-md p-4 text-center bg-white">
            <p className="text-sm text-gray-500">Click the "Upload Signature" button to select an image file</p>
          </div>
        )}

        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">
            {hasSignature
              ? mode === "draw"
                ? "Signature captured"
                : mode === "type"
                  ? "Typed signature"
                  : "Uploaded signature"
              : "Sign above using your preferred method"}
            {required && !hasSignature && <span className="text-red-500 ml-1">*</span>}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!hasSignature}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" /> Clear
          </Button>
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Hidden input to store signature data */}
      <input type="hidden" name={name} value={value || ""} required={required} />
    </div>
  )
}
