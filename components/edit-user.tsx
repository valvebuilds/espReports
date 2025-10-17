/*"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import type { User } from "@/lib/users";

interface EditUserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export function EditUserModal({ user, open, onClose, onSave }: EditUserModalProps) {
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [rol, setRol] = useState("");

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setArea(user.area);
      setRol(user.rol);
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    onSave({
      ...user,
      nombre,
      area,
      rol,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área</Label>
            <Input
              id="area"
              value={area ?? ""}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select value={rol} onValueChange={setRol}>
              <SelectTrigger id="rol">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                <SelectItem value="OPERARIO">Operario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
*/