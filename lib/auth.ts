import { User } from "./users";
import { getToken, setCurrentUser } from "./storage";
import { apiService } from "./api";

export interface AuthResponse {
  token: string;
  user: User;
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<AuthResponse | null> {
  try {
    const response = await apiService.login(username, password);
    const data : AuthResponse = (response.data);
    if (response.success) {
    // Store token + user data in localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));
    setCurrentUser(data.user);
    return data;
    }
  } catch (error) {
    return null;
  }
}

export async function registerUser(
  nombre: string,
  usuario: string,
  contrasena: string,
  rol: string
): Promise<User | null> {
  try {
    const newUser: User = await apiService.register(nombre, usuario, contrasena, rol);
    return newUser;
  } catch (error) {
    console.error("Registration failed:", error);
    return null;
  }
}
