import empleadoService from "../services/empleadoService.js";

//Obtener todos los empleados activos
const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoService.getAllEmpleados();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo empleados' });
  }
};
//Crear empleado
const createEmpleado = async (req, res) => {
  try {
    const empleado = await empleadoService.createEmpleado(req.body);
    res.status(201).json(empleado);
  } catch (error) {
    res.status(400).json({ error: 'Error creando empleado' });
  }
};
//Obtener empleado por id
const getEmpleadoById = async (req, res) => {
    try {
        const empleado = await empleadoService.getEmpleadoById(req.params.id);
        if (empleado) {
            res.json(empleado);
        } else {
        res.status(404).json({ error: 'No se encontró al empleado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo al empleado' });
    }
};
//Actualizar empleado
const updateEmpleado = async (req, res) => {
  try {
    const empleadoActualizado = await empleadoService.updateEmpleado(req.params.id, req.body);
    res.json(empleadoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de empleado' });
  }
};
// Desactivar empleado (en vez de eliminarlo)
const deleteEmpleado = async (req, res) => {
  try {
    await empleadoService.deleteEmpleado(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error desactivando al empleado' });
  }
};

export default {
  getAllEmpleados,
  createEmpleado,
  getEmpleadoById,
  updateEmpleado,
  deleteEmpleado,
};