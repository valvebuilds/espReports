import { apiService } from "./api";
import { registerUser } from "./auth";
import { handleError } from "./errorHandler";

export interface User {
  id?: number;
  nombre: string;
  usuario: string;
  rol: string;
  area?: Area | null;
}
export interface Area {
  id: number;
  nombre: string;
}

export async function getUsers(): Promise<User[] | null> {
  try {
    const response = await apiService.getUsers();
    if (response.success) {
          const data: User[] = (response.data);
          return data;
        }
      }catch (error) {
        handleError(error);
        return null;
      }
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

export async function assignUserArea(id: number, areaId : any ): Promise<User> {
  return apiService.assignUserArea(id, areaId);
}

export async function deleteUser(id: number): Promise<void> {
  return apiService.deleteUser(id);
}

export async function getAreas(): Promise<Area[] | null> {
  try {
    const response = await apiService.getAreas();
    if (response.success) {
          const data: Area[] = (response.data);
          return data;
        }
      }catch (error) {
        handleError(error);
        return null;
      }
    }

  