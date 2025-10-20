"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getCurrentUser, setCurrentUser } from "@/lib/storage"
import { Clock, LogOut, FileText, Settings, PlusCircle } from "lucide-react"
import { TimeRegistrationForm } from "@/components/time-registration-form"
import { ReportsView } from "@/components/reports-view"
import { AdminConfig } from "./admin-config"

interface DashboardLayoutProps {
  onLogout: () => void
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const user = getCurrentUser()
  const [activeTab, setActiveTab] = useState<"register" | "reports" | "config">("register")

  if (!user) return null

  const handleLogout = () => {
    setCurrentUser(null)
    onLogout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Horas Extra</h1>
                <p className="text-sm text-muted-foreground">
                  {user.name} - {user.role}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <Button
              variant={activeTab === "register" ? "default" : "ghost"}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeTab === "register"}
              onClick={() => setActiveTab("register")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Registrar Tiempo
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeTab === "reports"}
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reportes
            </Button>
            {user.role === "ADMIN" && (
              <Button
                variant={activeTab === "config" ? "default" : "ghost"}
                className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={activeTab === "config"}
                onClick={() => setActiveTab("config")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === "register" && <TimeRegistrationForm />}
        {activeTab === "reports" && <ReportsView />}
        {activeTab === "config" && user.role === "ADMIN" && <AdminConfig />}
      </main>
    </div>
  )
}
