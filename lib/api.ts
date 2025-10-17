import { getToken } from "./storage";

const API_BASE_URL = "http://localhost:3001";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getToken();
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
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

  async assignUserArea(id: number, areaName: string | null) {
    return this.request(`/api/usuarios/${id}/asignar-area`, {
      method: "PUT",
      body: JSON.stringify({ areaName }),
    });
  }

  // Employee management endpoints
  async getEmployees() {
    return this.request("/api/empleados");
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
}

export const apiService = new ApiService();
