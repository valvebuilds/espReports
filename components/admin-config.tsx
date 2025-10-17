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
import { User, getUsers , createUser, editUser, deleteUser, assignUserArea } from "@/lib/users"

export function AdminConfig() {

  const [users, setUsers] = useState<User[]>([]);

  const [newUserName, setNewUserName] = useState("")
  const [newUserRol, setNewUserRol] = useState<"ADMIN" | "COORDINADOR" > ("COORDINADOR")
  const [newUserArea, setNewUserArea] = useState<"acueducto" | "alcantarillado" | "aseo">("acueducto")
  const[newUserUsuario, setNewUserUsuario] = useState("")
  const [newUserContrasena, setNewUserContrasena] = useState("")

  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [schedules, setSchedules] = useState<BaseSchedule[]>([])
  const [newEmployeeName, setNewEmployeeName] = useState("")
  const [newEmployeeCedula, setNewEmployeeCedula] = useState("")
  const [newEmployeeAreaId, setNewEmployeeAreaId] = useState<number>(1)
  const [newEmployeeHorarioId, setNewEmployeeHorarioId] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterArea, setFilterArea] = useState<string>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setSchedules(getBaseSchedules())
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      
      const fetchedEmployees = await getEmployees();
      setEmployees(fetchedEmployees);
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
    const area = newUserRol !== "ADMIN" ? newUserArea : null
    const password = newUserContrasena;

    const createdUser = await createUser({...newUser, contrasena: password});
    if(area!= null){
      await assignUserArea(createdUser.id!, area); 
    };
    console.log(createdUser);
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
      const newEmployee = await createEmployee({
        nombre: newEmployeeName.trim(),
        cedula: newEmployeeCedula.trim(),
        areaId: newEmployeeAreaId,
        horarioId: newEmployeeHorarioId,
      })

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
                        <Select value={newEmployeeAreaId.toString()} onValueChange={(v) => setNewEmployeeAreaId(parseInt(v))}>
                          <SelectTrigger id="employeeArea">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Alcantarillado</SelectItem>
                            <SelectItem value="2">Acueducto</SelectItem>
                            <SelectItem value="3">Aseo</SelectItem>
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
                          <Badge className={getAreaBadgeColor(employee.area?.nombre)}>{employee.area?.nombre}</Badge>
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
              <CardTitle>Horarios Base por Área</CardTitle>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nombre}</TableCell>
                        <TableCell>
                          <Badge className={getAreaBadgeColor(user.area?.nombre ?? 'default')}>
                            {user.area?.nombre ?? 'Sin área'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {user.rol}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id.toString())}>
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
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Usuario</DialogTitle>
                      <DialogDescription>Complete los datos del nuevo usuario</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Nombre Completo</Label>
                          <Input
                            id="userName"
                            placeholder="Ej: Juan Pérez"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                          />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userUsuario">Nombre de Usuario</Label>
                          <Input
                            id="userUsuario"
                            placeholder="Ej: admin, juanperez, acueducto1 "
                            value={newUserUsuario}
                            onChange={(e) => setNewUserUsuario(e.target.value)}
                          />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userPassword">Contraseña</Label>
                        <Input
                          id="userPassword"
                          type = "password"
                          value={newUserContrasena}
                          onChange={(e) => setNewUserContrasena(e.target.value)}
                        />
                      </div>
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
                        <Select value={newUserArea} onValueChange={(v) => setNewUserArea(v as any)}>
                          <SelectTrigger id="userArea">
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">Acueducto</SelectItem>
                            <SelectItem value="1">Alcantarillado</SelectItem>
                            <SelectItem value="3">Aseo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddUser}>Agregar</Button>
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
