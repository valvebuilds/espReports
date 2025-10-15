export type UserRole = "acueducto" | "alcantarillado" | "aseo" | "admin"

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  name: string
}

// Default users
export const defaultUsers: User[] = [
  {
    id: "1",
    username: "coord_acueducto",
    password: "acueducto123",
    role: "acueducto",
    name: "Coordinador Acueducto",
  },
  {
    id: "2",
    username: "coord_alcantarillado",
    password: "alcantarillado123",
    role: "alcantarillado",
    name: "Coordinador Alcantarillado",
  },
  {
    id: "3",
    username: "coord_aseo",
    password: "aseo123",
    role: "aseo",
    name: "Coordinador Aseo",
  },
  {
    id: "4",
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrador Master",
  },
]

export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    acueducto: "Acueducto",
    alcantarillado: "Alcantarillado",
    aseo: "Aseo",
    admin: "Administrador",
  }
  return roleNames[role]
}

export const authenticateUser = (username: string, password: string): User | null => {
  const user = defaultUsers.find((u) => u.username === username && u.password === password)
  return user || null
}
