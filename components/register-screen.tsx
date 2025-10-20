"use client"

import { useState } from "react"
import MobileFrame from "./mobile-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, EyeOff, Calendar } from "lucide-react"

interface RegisterScreenProps {
  onBack: () => void
}

export default function RegisterScreen({ onBack }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <MobileFrame>
      <div className="px-6 pt-8 pb-6 h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button onClick={onBack} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Crear cuenta</h1>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm"
                />
                <Input
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />

              <div className="relative">
                <Input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg pr-12"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <Input
                type="tel"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los términos y condiciones
              </label>
            </div>

            {/* Create Account Button */}
            <Button
              disabled={!acceptTerms}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl text-lg font-medium mb-6"
            >
              Crear cuenta
            </Button>

            <p className="text-center text-gray-400 text-sm mb-4">O</p>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full py-3 border border-gray-200 rounded-lg flex items-center justify-center gap-3 bg-transparent"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2.247c-5.52 0-10 4.48-10 10 0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12.247h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.375 22 17.238 22 12.247c0-5.52-4.48-10-10-10z"
                  />
                </svg>
                <span className="text-gray-700 font-medium text-sm">Continuar con Apple</span>
              </Button>

              <Button
                variant="outline"
                className="w-full py-3 border border-gray-200 rounded-lg flex items-center justify-center gap-3 bg-transparent"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-700 font-medium text-sm">Continuar con Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full py-3 border border-gray-200 rounded-lg flex items-center justify-center gap-3 bg-transparent"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-gray-700 font-medium text-sm">Continuar con Facebook</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
