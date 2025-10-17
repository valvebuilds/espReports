import { apiService } from "./api";

export interface Employee {
  id: number;
  nombre: string;
  cedula: string;
  areaId: number;
  horarioId: number;
  activo: boolean;
  area: {
    id: number;
    nombre: string;
  };
  creadoEn: string;
  actualizadoEn: string;
}

export interface Area {
  id: number;
  nombre: string;
}

export async function getEmployees(): Promise<Employee[]> {
  return apiService.getEmployees();
}

export async function createEmployee(employeeData: {
  nombre: string;
  cedula: string;
  areaId: number;
  horarioId: number;
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
