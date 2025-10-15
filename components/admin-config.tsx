"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  getWorkers,
  saveWorkers,
  getBaseSchedules,
  saveBaseSchedules,
  type Worker,
  type BaseSchedule,
} from "@/lib/storage"
import { getRoleName } from "@/lib/auth"
import { Settings, Users, Clock, Plus, Trash2, Save, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminConfig() {
  const { toast } = useToast()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [schedules, setSchedules] = useState<BaseSchedule[]>([])
  const [newWorkerName, setNewWorkerName] = useState("")
  const [newWorkerArea, setNewWorkerArea] = useState<"acueducto" | "alcantarillado" | "aseo">("acueducto")
  const [filterArea, setFilterArea] = useState<string>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const sorted = sortWorkersByArea(getWorkers())
    setWorkers(sorted)
    setSchedules(getBaseSchedules())
  }

  const sortWorkersByArea = (list: Worker[]) => {
    const areaOrder = { acueducto: 1, alcantarillado: 2, aseo: 3 }
    return [...list].sort((a, b) => areaOrder[a.area] - areaOrder[b.area])
  }

  const handleAddWorker = () => {
    if (!newWorkerName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del trabajador es requerido",
        variant: "destructive",
      })
      return
    }

    const newWorker: Worker = {
      id: Date.now().toString(),
      name: newWorkerName.trim(),
      area: newWorkerArea,
    }

    const updatedWorkers = sortWorkersByArea([...workers, newWorker])
    saveWorkers(updatedWorkers)
    setWorkers(updatedWorkers)
    setNewWorkerName("")
    setDialogOpen(false)

    toast({
      title: "Trabajador agregado",
      description: `${newWorker.name} ha sido agregado al área de ${getRoleName(newWorker.area)}`,
    })
  }

  const handleDeleteWorker = (id: string) => {
    const updatedWorkers = workers.filter((w) => w.id !== id)
    saveWorkers(updatedWorkers)
    setWorkers(updatedWorkers)

    toast({
      title: "Trabajador eliminado",
      description: "El trabajador ha sido eliminado correctamente",
    })
  }

  const handleScheduleChange = (
    area: "acueducto" | "alcantarillado" | "aseo",
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const updatedSchedules = schedules.map((s) => (s.area === area ? { ...s, [field]: value } : s))
    setSchedules(updatedSchedules)
  }

  const handleSaveSchedules = () => {
    saveBaseSchedules(schedules)
    toast({
      title: "Horarios guardados",
      description: "Los horarios base han sido actualizados correctamente",
    })
  }

  const getAreaBadgeColor = (area: string) => {
    switch (area) {
      case "acueducto":
        return "bg-blue-500"
      case "alcantarillado":
        return "bg-green-500"
      case "aseo":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  // Aplicar filtro antes de renderizar
  const filteredWorkers =
    filterArea === "todos" ? workers : workers.filter((w) => w.area === filterArea)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Panel de Configuración
          </CardTitle>
          <CardDescription>Administre trabajadores y horarios base del sistema</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="workers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workers">
            <Users className="h-4 w-4 mr-2" />
            Trabajadores
          </TabsTrigger>
          <TabsTrigger value="schedules">
            <Clock className="h-4 w-4 mr-2" />
            Horarios Base
          </TabsTrigger>
        </TabsList>

        {/* TAB DE TRABAJADORES */}
        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Gestión de Trabajadores</CardTitle>
                  <CardDescription>Agregue, elimine o filtre trabajadores por zona</CardDescription>
                </div>

                {/* FILTRO DE ZONA */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterArea} onValueChange={setFilterArea}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filtrar por área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="acueducto">Acueducto</SelectItem>
                      <SelectItem value="alcantarillado">Alcantarillado</SelectItem>
                      <SelectItem value="aseo">Aseo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* BOTÓN AGREGAR */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Trabajador</DialogTitle>
                      <DialogDescription>Complete los datos del nuevo trabajador</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="workerName">Nombre Completo</Label>
                        <Input
                          id="workerName"
                          placeholder="Ej: Juan Pérez"
                          value={newWorkerName}
                          onChange={(e) => setNewWorkerName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workerArea">Área</Label>
                        <Select value={newWorkerArea} onValueChange={(v) => setNewWorkerArea(v as any)}>
                          <SelectTrigger id="workerArea">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acueducto">Acueducto</SelectItem>
                            <SelectItem value="alcantarillado">Alcantarillado</SelectItem>
                            <SelectItem value="aseo">Aseo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddWorker}>Agregar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            {/* TABLA */}
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell>
                          <Badge className={getAreaBadgeColor(worker.area)}>{getRoleName(worker.area)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteWorker(worker.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredWorkers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay trabajadores registrados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB DE HORARIOS */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horarios Base por Área</CardTitle>
              <CardDescription>Configure los horarios de trabajo estándar para cada área</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {schedules.map((schedule) => (
                <div key={schedule.area} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getAreaBadgeColor(schedule.area)}>{getRoleName(schedule.area)}</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${schedule.area}-start`}>Hora de Inicio</Label>
                      <Input
                        id={`${schedule.area}-start`}
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange(schedule.area, "startTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${schedule.area}-end`}>Hora de Fin</Label>
                      <Input
                        id={`${schedule.area}-end`}
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange(schedule.area, "endTime", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveSchedules} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar Horarios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
