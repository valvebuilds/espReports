import { apiService } from "./api";
import { handleError } from "./errorHandler";

export interface Asignacion {
  id: number;
  empleadoId: number;
  turnoId: number;
  fechaInicio: string;
  fechaFin?: string | null;
  empleado: {
    id: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
  };
  turno: {
    id: number;
    nombre: string;
    codigoTurno: string;
  };
}

export interface Turno {
  id: number;
  areaId: number;
  nombre: string;
  activo: boolean;
  horarios: Horario[];
  _count: {
    asignaciones: number;
    horarios: number;
  };
}

export async function obtenerTurnos(params?: {
    activo?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Turno[] | null> {
        const queryString = new URLSearchParams();
        if (params?.activo !== undefined) queryString.append("activo", String(params.activo));
        if (params?.limit) queryString.append("limit", String(params.limit));
        if (params?.offset) queryString.append("offset", String(params.offset));

        const query = queryString.toString() ? `?${queryString.toString()}` : "";
        try {
            const response = apiService.obtenerTodosTurnos(query);
        if (response.success) {
              const data: Turno[] = (response.data);
              return data;
            }
        }catch (err){
            handleError(error);
            return null;
        }
    
  }
