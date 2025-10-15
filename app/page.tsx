"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { getCurrentUser } from "@/lib/storage"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    setIsAuthenticated(!!user)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return <DashboardLayout onLogout={() => setIsAuthenticated(false)} />
}
