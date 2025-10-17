import { apiService } from "./api";

export interface TimeRecord {
  id: number;
  empleadoId: number;
  empleado: {
    id: number;
    nombre: string;
    area: {
      id: number;
      nombre: string;
    };
  };
  horaInicio: string;
  horaFin: string;
  horasDiurnas: number;
  horasNocturnas: number;
  horasDominicales: number;
  totalHours: number;
  observaciones?: string;
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateTimeRecordData {
  empleadoId: number;
  coordinadorId: number;
  horaInicio: string;
  horaFin: string;
  observaciones?: string;
  estado?: string;
}

export async function getTimeRecords(): Promise<TimeRecord[]> {
  return apiService.getTimeRecords();
}

export async function createTimeRecord(recordData: CreateTimeRecordData): Promise<TimeRecord> {
  return apiService.createTimeRecord(recordData);
}

export async function getTimeRecordById(id: number): Promise<TimeRecord> {
  return apiService.getTimeRecordById(id);
}

export async function updateTimeRecord(id: number, recordData: Partial<CreateTimeRecordData>): Promise<TimeRecord> {
  return apiService.updateTimeRecord(id, recordData);
}

export async function deleteTimeRecord(id: number): Promise<void> {
  return apiService.deleteTimeRecord(id);
}

// Helper function to calculate hours between two times
export function calculateHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const diffMinutes = endMinutes - startMinutes;
  return Math.round((diffMinutes / 60) * 100) / 100;
}
