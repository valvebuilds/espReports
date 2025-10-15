import type { User } from "./auth"

export interface Worker {
  id: string
  name: string
  area: "acueducto" | "alcantarillado" | "aseo"
}

export interface TimeRecord {
  id: string
  workerId: string
  workerName: string
  area: "acueducto" | "alcantarillado" | "aseo"
  date: string
  startTime: string
  endTime: string
  totalHours: number
  description: string
  registeredBy: string
  registeredAt: string
}

export interface BaseSchedule {
  area: "acueducto" | "alcantarillado" | "aseo"
  startTime: string
  endTime: string
}

const STORAGE_KEYS = {
  WORKERS: "overtime_workers",
  TIME_RECORDS: "overtime_records",
  BASE_SCHEDULES: "overtime_schedules",
  CURRENT_USER: "overtime_current_user",
}

// Workers management
export const getWorkers = (): Worker[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.WORKERS)
  return data ? JSON.parse(data) : getDefaultWorkers()
}

export const saveWorkers = (workers: Worker[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))
}

export const getDefaultWorkers = (): Worker[] => {
  return [
    { id: "1", name: "Juan Pérez", area: "acueducto" },
    { id: "2", name: "María García", area: "acueducto" },
    { id: "3", name: "Carlos López", area: "alcantarillado" },
    { id: "4", name: "Ana Martínez", area: "alcantarillado" },
    { id: "5", name: "Pedro Rodríguez", area: "aseo" },
    { id: "6", name: "Laura Sánchez", area: "aseo" },
  ]
}

// Time records management
export const getTimeRecords = (): TimeRecord[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.TIME_RECORDS)
  return data ? JSON.parse(data) : []
}

export const saveTimeRecord = (record: TimeRecord): void => {
  if (typeof window === "undefined") return
  const records = getTimeRecords()
  records.push(record)
  localStorage.setItem(STORAGE_KEYS.TIME_RECORDS, JSON.stringify(records))
}

export const deleteTimeRecord = (id: string): void => {
  if (typeof window === "undefined") return
  const records = getTimeRecords().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEYS.TIME_RECORDS, JSON.stringify(records))
}

// Base schedules management
export const getBaseSchedules = (): BaseSchedule[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.BASE_SCHEDULES)
  return data ? JSON.parse(data) : getDefaultSchedules()
}

export const saveBaseSchedules = (schedules: BaseSchedule[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.BASE_SCHEDULES, JSON.stringify(schedules))
}

export const getDefaultSchedules = (): BaseSchedule[] => {
  return [
    { area: "acueducto", startTime: "08:00", endTime: "17:00" },
    { area: "alcantarillado", startTime: "08:00", endTime: "17:00" },
    { area: "aseo", startTime: "06:00", endTime: "14:00" },
  ]
}

// Current user management
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Calculate hours between two times
export const calculateHours = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(":").map(Number)
  const [endHour, endMin] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  const diffMinutes = endMinutes - startMinutes
  return Math.round((diffMinutes / 60) * 100) / 100
}
