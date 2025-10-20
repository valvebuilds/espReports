import { getToken } from "./storage";

const API_BASE_URL = "http://localhost:3001";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    let response: Response;
    try {
      response = await fetch(`${this.baseURL}${endpoint}`, config);
    } catch {
      throw {
        success: false,
        message: "No se pudo realizar la autenticación.",
        timestamp: new Date().toISOString(),
      } as ApiResponse;
    }

    let body: ApiResponse<T> | null = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      throw body ?? {
        success: false,
        message: `Error HTTP ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    }

    return body!;
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async register(nombre: string, usuario: string, contrasena: string, rol: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nombre, usuario, contrasena, rol }),
    });
  }

  // User management endpoints
  async getUsers() {
    return this.request("/api/usuarios");
  }

  async createUser(userData: any) {
    return this.request("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any) {
    console.log("Updating user:", id, userData);
    return this.request(`/api/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number) {
    return this.request(`/api/usuarios/${id}`, {
      method: "DELETE",
    });
  }

  async assignUserArea(id: number, areaId: string | null) {
    return this.request(`/api/usuarios/${id}/asignar-area`, {
      method: "PUT",
      body: JSON.stringify({ areaId }),
    });
  }

  // Employee management endpoints
  async getEmployees() {
    return this.request("/api/empleados");
  }

  async getEmployeesByAreaIds() {
    return this.request("/api/empleados/area");
  }

  async createEmployee(employeeData: any) {
    return this.request("/api/empleados", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
  }

  async getEmployeeById(id: number) {
    return this.request(`/api/empleados/${id}`);
  }

  // Area management endpoints
  async getAreas() {
    return this.request("/api/areas");
  }

  async createArea(areaData: any) {
    return this.request("/api/areas", {
      method: "POST",
      body: JSON.stringify(areaData),
    });
  }

  async updateArea(id: number, areaData: any) {
    return this.request(`/api/areas/${id}`, {
      method: "PUT",
      body: JSON.stringify(areaData),
    });
  }

  // Time records endpoints
  async getTimeRecords() {
    return this.request("/api/registros");
  }

  async createTimeRecord(recordData: any) {
    return this.request("/api/registros", {
      method: "POST",
      body: JSON.stringify(recordData),
    });
  }

  async getTimeRecordById(id: number) {
    return this.request(`/api/registros/${id}`);
  }

  async updateTimeRecord(id: number, recordData: any) {
    return this.request(`/api/registros/${id}`, {
      method: "PUT",
      body: JSON.stringify(recordData),
    });
  }

  async deleteTimeRecord(id: number) {
    return this.request(`/api/registros/${id}`, {
      method: "DELETE",
    });
  }

async obtenerTodosTurnos(query:string) {
    
    return this.request<Turno[]>(`/api/turnos${query}`);
  }

  async obtenerTurnoPorId(id: number) {
    return this.request<Turno>(`/api/turnos/${id}`);
  }

  async obtenerTurnosPorArea(areaId: number) {
    return this.request<Turno[]>(`/api/turnos/area/${areaId}`);
  }

  async obtenerTurnosPorAreaConInactivos(areaId: number) {
    return this.request<Turno[]>(`/api/turnos/area/${areaId}/con-inactivos`);
  }

  async obtenerTurnosConEmpleados(areaId: number) {
    return this.request<Turno[]>(`/api/turnos/area/${areaId}/con-empleados`);
  }

  async obtenerOpcionesTurnosPorArea(areaId: number) {
    return this.request<any[]>(`/api/turnos/area/${areaId}/opciones`);
  }

  async obtenerTurnosActivos() {
    return this.request<Turno[]>(`/api/turnos/activos`);
  }

  async crearTurno(data: { nombre: string; areaId: number }) {
    return this.request<Turno>(`/api/turnos`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async actualizarTurno(
    id: number,
    data: {
      nombre?: string;
      areaId?: number;
      activo?: boolean;
    }
  ) {
    return this.request<Turno>(`/api/turnos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async eliminarTurno(id: number) {
    return this.request(`/api/turnos/${id}`, {
      method: "DELETE",
    });
  }

  async verificarTurnoTieneHorarios(id: number) {
    return this.request<{ turnoId: number; tieneHorarios: boolean }>(
      `/api/turnos/${id}/tiene-horarios`
    );
  }

  async verificarTurnoTieneEmpleados(id: number) {
    return this.request<{ turnoId: number; tieneEmpleadosAsignados: boolean }>(
      `/api/turnos/${id}/tiene-empleados`
    );
  }

  async obtenerResumenTurno(id: number) {
    return this.request<{
      id: number;
      nombre: string;
      area: string;
      estado: string;
      horariosConfigurados: number;
      empleadosAsignados: number;
      diasConHorario: string[];
    }>(`/api/turnos/${id}/resumen`);
  }

  // ============================================
  // ASIGNACIONES ENDPOINTS
  // ============================================

  async obtenerTodasAsignaciones(params?: {
    empleadoId?: number;
    turnoId?: number;
    estado?: "activa" | "inactiva";
    limit?: number;
    offset?: number;
  }) {
    const queryString = new URLSearchParams();
    if (params?.empleadoId) queryString.append("empleadoId", String(params.empleadoId));
    if (params?.turnoId) queryString.append("turnoId", String(params.turnoId));
    if (params?.estado) queryString.append("estado", params.estado);
    if (params?.limit) queryString.append("limit", String(params.limit));
    if (params?.offset) queryString.append("offset", String(params.offset));

    const query = queryString.toString() ? `?${queryString.toString()}` : "";
    return this.request<Asignacion[]>(`/api/asignaciones${query}`);
  }

  async obtenerAsignacionPorId(id: number) {
    return this.request<Asignacion>(`/api/asignaciones/${id}`);
  }

  async obtenerAsignacionesPorEmpleado(empleadoId: number) {
    return this.request<Asignacion[]>(`/api/asignaciones/empleado/${empleadoId}`);
  }

  async obtenerAsignacionActivaPorEmpleado(empleadoId: number) {
    return this.request<Asignacion>(`/api/asignaciones/empleado/${empleadoId}/activa`);
  }

  async obtenerTurnoPorFecha(empleadoId: number, fecha: Date) {
    const fechaString = fecha.toISOString().split("T")[0];
    return this.request<Asignacion>(
      `/api/asignaciones/empleado/${empleadoId}/turno-fecha?fecha=${fechaString}`
    );
  }

  async obtenerHistorialAsignaciones(empleadoId: number, limit?: number) {
    const query = limit ? `?limit=${limit}` : "";
    return this.request<Asignacion[]>(
      `/api/asignaciones/empleado/${empleadoId}/historial${query}`
    );
  }

  async verificarEmpleadoTieneAsignacionActiva(empleadoId: number) {
    return this.request<{
      empleadoId: number;
      tieneAsignacionActiva: boolean;
    }>(`/api/asignaciones/empleado/${empleadoId}/tiene-activa`);
  }

  async crearAsignacion(data: {
    empleadoId: number;
    turnoId: number;
    fechaInicio: string;
    fechaFin?: string | null;
  }) {
    return this.request<Asignacion>(`/api/asignaciones`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async actualizarAsignacion(
    id: number,
    data: {
      turnoId?: number;
      fechaInicio?: string;
      fechaFin?: string | null;
    }
  ) {
    return this.request<Asignacion>(`/api/asignaciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async cerrarAsignacion(id: number, fechaFin?: string) {
    const body = fechaFin ? { fechaFin } : {};
    return this.request<Asignacion>(`/api/asignaciones/${id}/cerrar`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async eliminarAsignacion(id: number) {
    return this.request(`/api/asignaciones/${id}`, {
      method: "DELETE",
    });
  }

  async obtenerAsignacionesActivas() {
    return this.request<Asignacion[]>(`/api/asignaciones/activas`);
  }

  async obtenerAsignacionesPorArea(areaId: number) {
    return this.request<Asignacion[]>(`/api/asignaciones/area/${areaId}`);
  }

  async contarEmpleadosPorTurno(turnoId: number) {
    return this.request<{
      turnoId: number;
      empleadosAsignados: number;
    }>(`/api/asignaciones/turno/${turnoId}/empleados`);
  }

  async obtenerAsignacionesPorRangoFechas(fechaInicio: Date, fechaFin: Date) {
    const inicio = fechaInicio.toISOString().split("T")[0];
    const fin = fechaFin.toISOString().split("T")[0];
    return this.request<Asignacion[]>(
      `/api/asignaciones/rango-fechas?fechaInicio=${inicio}&fechaFin=${fin}`
    );
  }
}


export const apiService = new ApiService();
