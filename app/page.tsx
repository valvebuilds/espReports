"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentUser, getToken, clearAuth } from "@/lib/storage"
import type { User } from "@/lib/auth"

export default function Home() {
  const [user, setUser] = useState<User|null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // obtener el usuario y el token del localStorage
  useEffect(() => {
    const token = getToken()
    const storedUser = getCurrentUser()
    if (token && storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  // manejar el éxito de la autenticación
 const handleLoginSuccess = (userData: any) => {
    setUser(userData)
    setError(null)
  }
// manejar el fallo de la autenticación
  const handleLoginFailure = () => {
    setError("Credenciales inválidas. Inténtalo de nuevo.")
  }

  const handleLogout = () => {
    clearAuth()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
// si no hay usuario, mostrar el formulario de login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        {error && (
          <p className="text-red-600 font-medium">{error}</p>
        )}
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onLoginFailure={handleLoginFailure}
        />
      </div>
    )
  }

  return <DashboardLayout onLogout={handleLogout} />
}
