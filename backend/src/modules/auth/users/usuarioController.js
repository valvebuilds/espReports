import usuarioService from "./usuarioService.js";

//Obtener todas las Usuarios 
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
    console.log(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Usuarios' });
  }
};
//Crear Usuario
const createUsuario = async (req, res) => {
  try {
    const Usuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(Usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error creando Usuario' });
  }
};
//Actualizar Usuario
const updateUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await usuarioService.updateUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de Usuario' });
  }
};
// Desactivar Usuario (en vez de eliminarlo)
const deleteUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const success = await usuarioService.deleteUsuario(id);
    console.log(success);
    res.status(200).json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    res.status(400).json({ error: 'Error eliminando al Usuario' });
  }
};
//Obtener Usuario por id
const getUsuarioById = async (req, res) => {
    try {
        const Usuario = await usuarioService.getUsuarioById(req.params.id);
        if (Usuario) {
            res.json(Usuario);
        } else {
        res.status(404).json({ error: 'No se encontró el Usuario' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Usuario' });
    }
};

const getUsuarioByIdAndAreas = async (req, res) => {
    try {
        const areas = req.user.role === 'COORDINADOR' ? req.user.areas : [];
        const Usuario = await usuarioService.getUsuarioByIdAndAreas(req.params.id, areas);
        if (Usuario) {
            res.json(Usuario);
        } else {
        res.status(404).json({ error: 'No se encontró el Usuario en tus áreas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Usuario' });
    }
}

const asignarAreaAUsuario = async (req, res) => {
    try {
        const { areaId } = req.body;
        const usuarioId = parseInt(req.params.id);

        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        const usuarioActualizado = await usuarioService.asignarAreaAUsuario(usuarioId, areaId);
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error asignando área al usuario' });
    }
};
export default {
  getAllUsuarios,
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  getUsuarioByIdAndAreas,
  asignarAreaAUsuario
};