"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentUser} from "@/lib/storage"
import { User }from "@/lib/users"
import { getEmployees, type Employee } from "@/lib/employees"
import { createTimeRecord, calculateHours, type TimeRecord } from "@/lib/timeRecords"
import { Clock, Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export function TimeRegistrationForm() {
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log(currentUser);
    setUser(currentUser)

    const loadEmployees = async () => {
      try {
        const allEmployees = currentUser?.role ==="COORDINADOR"
        ? await getEmployees(currentUser.area) 
        : await getEmployees();
        console.log(allEmployees);  
        const filteredEmployees =
          currentUser?.role === "ADMIN"
            ? allEmployees
            : allEmployees.filter(
                (e) =>
                  (e.area?.nombre ?? "").toLowerCase() ===
                  (currentUser?.area?.nombre ?? "").toLowerCase()
              )
        setEmployees(filteredEmployees??[])
      } catch (error) {
        console.error("Fallo cargando empleados:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los empleados",
          variant: "destructive",
        })
      }
    }

    loadEmployees()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!selectedEmployee) {
      setError("Debe seleccionar un empleado")
      setLoading(false)
      return
    }

    if (!startTime || !endTime) {
      setError("Debe ingresar hora de inicio y fin")
      setLoading(false)
      return
    }

    const totalHours = calculateHours(startTime, endTime)
    if (totalHours <= 0) {
      setError("La hora de fin debe ser posterior a la hora de inicio")
      setLoading(false)
      return
    }

    const employee = employees.find((e) => e.id.toString() === selectedEmployee)
    if (!employee) {
      setError("Empleado no encontrado")
      setLoading(false)
      return
    }

    try {
      // crear strings ISO para hora de inicio y fin
      const startDateTime = new Date(`${date}T${startTime}`).toISOString();
      const endDateTime = new Date(`${date}T${endTime}`).toISOString();
      
      await createTimeRecord({
        empleadoId: employee.id,
        coordinadorId: user?.id || 1, // usar id del usuario actual o 1 por defecto
        horaInicio: startDateTime,
        horaFin: endDateTime,
        observaciones: description,
        estado: "PENDIENTE",
      })

      toast({
        title: "Registro guardado",
        description: `Se registraron ${totalHours} horas para ${employee.nombre}`,
      })

      // Reset form
      setSelectedEmployee("")
      setStartTime("")
      setEndTime("")
      setDescription("")
    } catch (error) {
      setError("Error al guardar el registro. Intente nuevamente.")
      console.error("Error saving time record:", error)
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Registrar Tiempo Extra
        </CardTitle>
        <CardDescription>Complete el formulario para registrar las horas extra trabajadas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employee">Empleado *</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Seleccione un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de Inicio *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de Fin *</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {startTime && endTime && calculateHours(startTime, endTime) > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Total de horas: {calculateHours(startTime, endTime)} horas
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descripción de la actividad</Label>
            <Textarea
              id="description"
              placeholder="Describa brevemente la actividad realizada..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Guardando..." : "Guardar Registro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
