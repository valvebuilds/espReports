import type { User } from "./users";

export function getToken(): string | null {
  return localStorage.getItem("authToken");
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
}

export function clearAuth(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}

export interface BaseSchedule {
  area: "acueducto" | "alcantarillado" | "aseo"
  startTime: string
  endTime: string
}

const STORAGE_KEYS = {
  BASE_SCHEDULES: "overtime_schedules",
  CURRENT_USER: "overtime_current_user",
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

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}
