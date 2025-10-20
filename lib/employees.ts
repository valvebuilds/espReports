import { ca } from "date-fns/locale";
import { apiService } from "./api";
import { handleError } from "./errorHandler";

export interface Employee {
  id: number;
  nombre: string;
  cedula: string;
  areaId: number;
  horarioId?: number;
  activo: boolean;
  area: {
    id: number;
    nombre: string;
  };
  horario?: {
    id: number;
    nombre: string;
    diaSemana: string;
    horaInicio: Date;
    horaFin: Date;
  };
  creadoEn: string;
  actualizadoEn: string;
}

export interface Area {
  id: number;
  nombre: string;
}

export async function getEmployees(area?:any): Promise<Employee[] | null> {
  try {
    let response;
    if (area){
      response = await apiService.getEmployeesByAreaIds();
    }else{
      response = await apiService.getEmployees();
    }
  
    if (response.success) {
      const data: Employee[] = (response.data);
      return data;
    }
  }catch (error) {
    handleError(error);
    return [];
  }
}

export async function createEmployee(employeeData: {
  nombre: string;
  cedula: string;
  areaId: number;
}): Promise<Employee> {
  return apiService.createEmployee(employeeData);
}

export async function getEmployeeById(id: number): Promise<Employee> {
  return apiService.getEmployeeById(id);
}

export async function getAreas(): Promise<Area[]> {
  return apiService.getAreas();
}

export async function createArea(areaData: { nombre: string }): Promise<Area> {
  return apiService.createArea(areaData);
}

export async function updateArea(id: number, areaData: { nombre: string }): Promise<Area> {
  return apiService.updateArea(id, areaData);
}
