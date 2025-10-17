import { apiService } from "./api";
import { registerUser } from "./auth";

export interface User {
  id?: number;
  nombre: string;
  usuario: string;
  rol: string;
  area?: { nombre: string | null | undefined};
}

export async function getUsers(): Promise<User[]> {
  return apiService.getUsers();
}

export async function createUser(
  data: Omit<User, "id"> & { contrasena: string }
): Promise<User> {
  const { nombre, usuario, contrasena, rol } = data;

  const newUser = await registerUser(nombre, usuario, contrasena, rol);

  if (!newUser) {
    throw new Error("User registration failed");
  }
  
  return newUser;
}

export async function editUser(id: number, data: Partial<User>): Promise<User> {
  return apiService.updateUser(id, data);
}

export async function assignUserArea(id: number, areaName: string | null): Promise<User> {
  return apiService.assignUserArea(id, areaName);
}

export async function deleteUser(id: number): Promise<void> {
  return apiService.deleteUser(id);
}
