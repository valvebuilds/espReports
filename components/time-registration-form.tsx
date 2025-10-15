"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  getCurrentUser,
  getWorkers,
  saveTimeRecord,
  calculateHours,
  type Worker,
  type TimeRecord,
  type User,
} from "@/lib/storage"
import { Clock, Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export function TimeRegistrationForm() {
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorker, setSelectedWorker] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    const allWorkers = getWorkers()
    const filteredWorkers =
      currentUser?.role === "admin" ? allWorkers : allWorkers.filter((w) => w.area === currentUser?.role)
    setWorkers(filteredWorkers)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!selectedWorker) {
      setError("Debe seleccionar un trabajador")
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

    const worker = workers.find((w) => w.id === selectedWorker)
    if (!worker) {
      setError("Trabajador no encontrado")
      setLoading(false)
      return
    }

    const record: TimeRecord = {
      id: Date.now().toString(),
      workerId: worker.id,
      workerName: worker.name,
      area: worker.area,
      date,
      startTime,
      endTime,
      totalHours,
      description,
      registeredBy: user?.name || "",
      registeredAt: new Date().toISOString(),
    }

    saveTimeRecord(record)

    toast({
      title: "Registro guardado",
      description: `Se registraron ${totalHours} horas para ${worker.name}`,
    })

    // Reset form
    setSelectedWorker("")
    setStartTime("")
    setEndTime("")
    setDescription("")
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Registrar Tiempo Adicional
        </CardTitle>
        <CardDescription>Complete el formulario para registrar las horas adicionales trabajadas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="worker">Trabajador *</Label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger id="worker">
                  <SelectValue placeholder="Seleccione un trabajador" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name}
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
