import empleadoService from './empleadoService.js';

//Obtener todos los empleados activos
const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoService.getAllEmpleados();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo empleados' });
  }
};
//Obtener empleados por área
const getEmpleadosByArea = async (req, res) => {
    try {
        const areasId = req.coordinadorAreas;
        const empleados = await empleadoService.getEmpleadoByArea(areasId); 
        return empleados;
    } catch (error) {
        console.error("Error en getEmpleadosByArea:", error);
        // El error handling debe usar la variable 'areasId' ya modificada
        const areasStr = Array.isArray(areasId) ? areasId.join(', ') : 'desconocida';
        res.status(500).json({ error: `Error obteniendo Empleados del área(s): ${areasStr}` });
    }
};
const getEmpleados = async (req, res) => {
    const rol = req.user.rol || req.user.role;
    let empleados;
    try {
        if (rol === 'ADMIN'){
            empleados = await empleadoService.getAllEmpleados();
        } 
        else if (rol === 'COORDINADOR'){
            const areas = req.coordinadorAreas;
            empleados = await empleadoService.getEmpleadoByArea(areas); 
        } 
        if (empleados) {
            res.json(empleados);
        } else {
            res.status(404).json({ error: 'No se encontraron empleados o rol no permitido.' });
        }
    } catch (error) {
        // ... manejo de errores
        res.status(500).json({ error: 'Error obteniendo Empleados' });
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
      let empleados;
      if (rol === 'ADMIN'){
            empleado = await empleadoService.getEmpleadoById(req.params.id);
        } 
        else if (rol === 'COORDINADOR'){
            const areas = req.coordinadorAreas;
            empleado = await empleadoService.getEmpleadoByIdAndAreas(req.params.id, areas); 
        } 
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
  getEmpleados,
  getEmpleadosByArea
};