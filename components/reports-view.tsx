"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, getTimeRecords, deleteTimeRecord, type TimeRecord, type User } from "@/lib/storage"
import { getRoleName } from "@/lib/auth"
import { FileText, Download, Trash2, Calendar, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ReportPeriod = "daily" | "weekly" | "monthly" | "custom"

export function ReportsView() {
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()
  const [records, setRecords] = useState<TimeRecord[]>([])
  const [period, setPeriod] = useState<ReportPeriod>("daily")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    loadRecords(currentUser)
  }, [])

  const loadRecords = (currentUser: User | null = user) => {
    const allRecords = getTimeRecords()
    // Filter by user's area if not admin
    const filteredRecords =
      currentUser?.role === "admin" ? allRecords : allRecords.filter((r) => r.area === currentUser?.role)
    setRecords(filteredRecords)
  }

  const filteredRecords = useMemo(() => {
    let filtered = records

    // Filter by area
    if (selectedArea !== "all") {
      filtered = filtered.filter((r) => r.area === selectedArea)
    }

    // Filter by date range
    const start = new Date(startDate)
    const end = new Date(endDate)

    filtered = filtered.filter((r) => {
      const recordDate = new Date(r.date)
      return recordDate >= start && recordDate <= end
    })

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [records, selectedArea, startDate, endDate])

  const totalHours = useMemo(() => {
    return filteredRecords.reduce((sum, record) => sum + record.totalHours, 0)
  }, [filteredRecords])

  const handlePeriodChange = (newPeriod: ReportPeriod) => {
    setPeriod(newPeriod)
    const today = new Date()

    switch (newPeriod) {
      case "daily":
        setStartDate(today.toISOString().split("T")[0])
        setEndDate(today.toISOString().split("T")[0])
        break
      case "weekly":
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        setStartDate(weekStart.toISOString().split("T")[0])
        setEndDate(weekEnd.toISOString().split("T")[0])
        break
      case "monthly":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        setStartDate(monthStart.toISOString().split("T")[0])
        setEndDate(monthEnd.toISOString().split("T")[0])
        break
    }
  }

  const handleDelete = (id: string) => {
    setRecordToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (recordToDelete) {
      deleteTimeRecord(recordToDelete)
      loadRecords()
      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado correctamente",
      })
    }
    setDeleteDialogOpen(false)
    setRecordToDelete(null)
  }

  const exportToCSV = () => {
    const headers = [
      "Fecha",
      "Trabajador",
      "Área",
      "Hora Inicio",
      "Hora Fin",
      "Total Horas",
      "Descripción",
      "Registrado Por",
    ]
    const rows = filteredRecords.map((r) => [
      r.date,
      r.workerName,
      getRoleName(r.area),
      r.startTime,
      r.endTime,
      r.totalHours.toString(),
      r.description || "",
      r.registeredBy,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reporte_${startDate}_${endDate}.csv`
    link.click()

    toast({
      title: "Reporte exportado",
      description: "El archivo CSV ha sido descargado",
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Registros</CardDescription>
            <CardTitle className="text-3xl">{filteredRecords.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Horas</CardDescription>
            <CardTitle className="text-3xl">{totalHours.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Promedio por Registro</CardDescription>
            <CardTitle className="text-3xl">
              {filteredRecords.length > 0 ? (totalHours / filteredRecords.length).toFixed(2) : "0"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={period} onValueChange={(v) => handlePeriodChange(v as ReportPeriod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            {user?.role === "admin" && (
              <div className="space-y-2">
                <Label>Área</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las áreas</SelectItem>
                    <SelectItem value="acueducto">Acueducto</SelectItem>
                    <SelectItem value="alcantarillado">Alcantarillado</SelectItem>
                    <SelectItem value="aseo">Aseo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Button onClick={exportToCSV} disabled={filteredRecords.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar a CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros de Tiempo
          </CardTitle>
          <CardDescription>
            Mostrando {filteredRecords.length} registro(s) del {startDate} al {endDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay registros para el período seleccionado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Hora Inicio</TableHead>
                    <TableHead>Hora Fin</TableHead>
                    <TableHead>Total Horas</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Registrado Por</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{new Date(record.date).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell>{record.workerName}</TableCell>
                      <TableCell>
                        <Badge className={getAreaBadgeColor(record.area)}>{getRoleName(record.area)}</Badge>
                      </TableCell>
                      <TableCell>{record.startTime}</TableCell>
                      <TableCell>{record.endTime}</TableCell>
                      <TableCell className="font-semibold">{record.totalHours}h</TableCell>
                      <TableCell className="max-w-xs truncate">{record.description || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.registeredBy}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
