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
  getBaseSchedules,
  saveBaseSchedules,
  type BaseSchedule,
} from "@/lib/storage"
import { getEmployees, createEmployee, type Employee } from "@/lib/employees"
import { Settings, Users, Clock, Plus, Trash2, Save, Filter, Edit2 } from "lucide-react"
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
import { User, Area, getUsers , getAreas, createUser, editUser, deleteUser, assignUserArea } from "@/lib/users"
import { isNull } from "util"


export function AdminConfig() {

  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([])
  const [schedules, setSchedules] = useState<BaseSchedule[]>([])
  const [areas, setAreas] = useState<Area[] >([])

  const [newUserName, setNewUserName] = useState("")
  const [newUserRol, setNewUserRol] = useState("")
  const [newUserArea, setNewUserArea] = useState<Area| any>(null)
  const [newUserUsuario, setNewUserUsuario] = useState("")
  const [newUserContrasena, setNewUserContrasena] = useState("")

  const { toast } = useToast()
  
  const [newEmployeeName, setNewEmployeeName] = useState("")
  const [newEmployeeCedula, setNewEmployeeCedula] = useState("")
  const [newEmployeeArea, setNewEmployeeArea] = useState<Area | null>(null)
  const [newEmployeeHorarioId, setNewEmployeeHorarioId] = useState<number>(1)
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filterArea, setFilterArea] = useState<string>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setSchedules(getBaseSchedules())
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers!);
      
      const fetchedEmployees = await getEmployees();
      setEmployees(fetchedEmployees!);

      const fetchedAreas = await getAreas();
      setAreas(fetchedAreas || []);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };
  
  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del usuario es requerido",
        variant: "destructive",
      })
      return
    }

    const newUser: User = {
      nombre: newUserName.trim(),
      usuario: newUserUsuario,
      rol: newUserRol,
    }
    const area = newUserRol !== "ADMIN" ? newUserArea : "Sin área";
    const password = newUserContrasena;

    const createdUser = await createUser({...newUser, contrasena: password});
    if(area!= null){
      await assignUserArea(createdUser.id!, area); 
    };
    setUsers([...users, createdUser]);
    setDialogOpen(false)

    toast({
      title: "Usuario agregado",
      description: `${newUser.nombre} ha sido agregado con el rol de ${(newUser.rol)}`,
    })
  }
  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(parseInt(id));
      setUsers(users.filter(user => user.id !== parseInt(id)));
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployeeName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del empleado es requerido",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await createEmployee({
        nombre: newEmployeeName.trim(),
        cedula: newEmployeeCedula.trim(),
        areaId: newEmployeeArea!.id
      })
      const newEmployee = response.data;
      setEmployees([...employees, newEmployee])
      setNewEmployeeName("")
      setNewEmployeeCedula("")
      setDialogOpen(false)

      toast({
        title: "Empleado agregado",
        description: `${newEmployee.nombre} ha sido agregado correctamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el empleado",
        variant: "destructive",
      })
    }
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
      case "Acueducto":
        return "bg-blue-500"
      case "Alcantarillado":
        return "bg-green-500"
      case "Aseo":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  // Aplicar filtro antes de renderizar
  const filteredEmployees =
    filterArea === "todos" ? employees : employees.filter((e) => e.area.nombre.toLowerCase() === filterArea)
  
    const getAreaBadgeColorUser = (area: string) => {
      switch (area.toLowerCase?.() ?? area) {
        case "acueducto": return "bg-blue-500"
        case "alcantarillado": return "bg-green-500"
        case "aseo": return "bg-orange-500"
        default: return "bg-gray-500"
      }
    }
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workers">
            <Users className="h-4 w-4 mr-2" />
            Trabajadores
          </TabsTrigger>
          <TabsTrigger value="schedules">
            <Clock className="h-4 w-4 mr-2" />
            Horarios Base
          </TabsTrigger>
          <TabsTrigger value="users">
            <Clock className="h-4 w-4 mr-2" />
            Usuarios
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
                      {areas.length > 0 ? (
                        areas.map((area) => (
                          <SelectItem key={area.id} value={area.nombre.toLowerCase()}>
                            {area.nombre}
                          </SelectItem>
                        ))
                      )  : (
                        <div className="p-2 text-sm text-gray-500">No hay áreas disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                   {/* 🔸 Botón para eliminar filtros */}
                    {filterArea!="todos" && <button
                      type="button"
                      onClick={() => setFilterArea("todos")}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      Limpiar
                    </button>}
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
                        <Label htmlFor="employeeName">Nombre Completo</Label>
                        <Input
                          id="employeeName"
                          placeholder="Ej: Juan Pérez"
                          value={newEmployeeName}
                          onChange={(e) => setNewEmployeeName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employeeCedula">Cédula</Label>
                        <Input
                          id="employeeCedula"
                          placeholder="Ej: 12345678"
                          value={newEmployeeCedula}
                          onChange={(e) => setNewEmployeeCedula(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workerArea">Área</Label>
                        <Select value={newEmployeeArea?.id.toString() ?? ""} onValueChange={(v) => {
                            const areaSeleccionada = areas.find((a) => a.id === Number(v)) || null;
                            setNewEmployeeArea(areaSeleccionada);
                          }}>
                          <SelectTrigger id="employeeArea">
                            <SelectValue />
                          </SelectTrigger>
                            <SelectContent>
                              {areas.length > 0 ? (
                                areas.map((area) => (
                                  <SelectItem key={area.id} value={area.id.toString()}>
                                  {area.nombre}
                                </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-sm text-gray-500">No hay áreas disponibles</div>
                              )}
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddEmployee}>Agregar</Button>
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
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.nombre}</TableCell>
                        <TableCell>
                        <Badge className={getAreaBadgeColor(employee.area?.nombre ?? 'Sin área')}>
                          {employee.area?.nombre ?? 'Sin área'}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" disabled>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredEmployees.length === 0 && (
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
              <CardTitle>Horarios Base por Turno</CardTitle>
              <CardDescription>Configure los horarios de trabajo estándar para cada área</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {schedules.map((schedule) => (
                <div key={schedule.area} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getAreaBadgeColor(schedule.area)}>{(schedule.area)}</Badge>
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
        {/* TAB DE USUARIOS */}
<TabsContent value="users" className="space-y-4">
  <Card>
    <CardHeader>
      <CardTitle>Usuarios y Roles</CardTitle>
      <CardDescription>Crear nuevos usuarios o modificar existentes</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Área</TableHead>
              <TableHead className="text-right">Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Badge className={getAreaBadgeColor(user.area?.nombre ?? "default")}>
                    {user.area?.nombre ?? "Sin área"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{user.role}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user)
                      setNewUserName(user.name)
                      setNewUserUsuario(user.username)
                      setNewUserRol(user.role)
                      setNewUserArea(user.area ?? null);
                      setDialogOpen(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id.toString())}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* BOTÓN AGREGAR */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedUser(null)
                setNewUserName("")
                setNewUserUsuario("")
                setNewUserContrasena("")
                setNewUserRol("COORDINADOR")
                setNewUserArea("")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? "Editar Usuario" : "Crear Usuario"}
              </DialogTitle>
              <DialogDescription>
                {selectedUser
                  ? "Modifique los datos del usuario existente"
                  : "Complete los datos del nuevo usuario"}
              </DialogDescription>
            </DialogHeader>

            {/* FORMULARIO */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Nombre Completo</Label>
                <Input
                  id="userName"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userUsuario">Usuario</Label>
                <Input
                  id="userUsuario"
                  value={newUserUsuario}
                  onChange={(e) => setNewUserUsuario(e.target.value)}
                />
              </div>

              {!selectedUser && (
                <div className="space-y-2">
                  <Label htmlFor="userPassword">Contraseña</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={newUserContrasena}
                    onChange={(e) => setNewUserContrasena(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="userRole">Rol</Label>
                <Select value={newUserRol} onValueChange={(v) => setNewUserRol(v as any)}>
                  <SelectTrigger id="userRole">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="COORDINADOR">Coordinador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newUserRol !== "ADMIN" && (
                <div className="space-y-2">
                  <Label htmlFor="userArea">Área</Label>
                  <Select
                  value={newUserArea?.id.toString() ?? ""}
                  onValueChange={(v) => {
                    const areaSeleccionada = areas.find((a) => a.id === Number(v)) || null;
                    setNewUserArea(areaSeleccionada);
                  }}
                >
                  <SelectTrigger id="userArea">
                    <SelectValue placeholder="Selecciona un área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas!=null? areas.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.nombre}
                      </SelectItem>
                    )): "No hay áreas disponibles"}
                  </SelectContent>
                </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>

              {selectedUser ? (
                <Button
                  onClick={async () => {
                    try {
                      await editUser(selectedUser.id!, {
                        nombre: newUserName,
                        usuario: newUserUsuario,
                        rol: newUserRol,
                      })
                      if (newUserRol !== "ADMIN") {
                        await assignUserArea(selectedUser.id!, newUserArea.id)
                      }
                      await loadData()
                      setDialogOpen(false)
                      toast({
                        title: "Usuario actualizado",
                        description: "Los datos del usuario fueron actualizados correctamente.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "No se pudo actualizar el usuario",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  Guardar cambios
                </Button>
              ) : (
                <Button onClick={handleAddUser}>Agregar</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>
    </div>
  )
}
