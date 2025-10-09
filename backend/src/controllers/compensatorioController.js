import compensatorioService from "../services/compensatorioService.js";

//Obtener todas las Compensatorios SOLO PARA ADMINS
const getAllCompensatorios = async (req, res) => {
  try {
    const compensatorios = await compensatorioService.getAllCompensatorios();
    return compensatorios;
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Compensatorios' });
  }
};
//Obtener compensatorios por área
const getCompensatorioByArea = async (req, res) => {
    try {
        const areasId = req.coordinadorAreas; 
        const compensatorios = await compensatorioService.getCompensatorioByArea(areasId); 
        return compensatorios;
    } catch (error) {
        console.error("Error en getCompensatorioByArea:", error);
        // El error handling debe usar la variable 'areasId' ya modificada
        const areasStr = Array.isArray(areasId) ? areasId.join(', ') : 'desconocida';
        res.status(500).json({ error: `Error obteniendo Compensatorios del área(s): ${areasStr}` });
    }
}
//Determina cual función llamar según el rol
const getCompensatorios = async (req, res) => {
  const rol = req.user.role;
  try {
    if (rol == 'ADMIN'){
      const compensatorios = await getAllCompensatorios(req, res);
      res.json(compensatorios);
    }
    if (rol == 'COORDINADOR'){
      const compensatorios = await getCompensatorioByArea(req, res);
      res.json(compensatorios);
    }
  } catch (error) {
    console.error("Error en getCompensatorios:", error);
        res.status(500).json({ error: 'Error obteniendo Compensatorios' });
  }
}
//Crear Compensatorio
const createCompensatorio = async (req, res) => {
  try {
    const compensatorio = await compensatorioService.createCompensatorio(req.body);
    res.status(201).json(compensatorio);
  } catch (error) {
    res.status(400).json({ error: 'Error creando Compensatorio' });
  }
};
//Obtener Compensatorio por id
const getCompensatorioById = async (req, res) => {
    try {
        const compensatorio = await compensatorioService.getCompensatorioById(req.params.id);
        if (compensatorio) {
            res.json(compensatorio);
        } else {
        res.status(404).json({ error: 'No se encontró el Compensatorio' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Compensatorio' });
    }
};
//Actualizar Compensatorio
const updateCompensatorio = async (req, res) => {
  try {
    const compensatorioActualizado = await compensatorioService.updateCompensatorio(req.params.id, req.body);
    res.json(compensatorioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de Compensatorio' });
  }
};
// Desactivar Compensatorio (en vez de eliminarlo)
const deleteCompensatorio = async (req, res) => {
  try {
    await compensatorioService.deleteCompensatorio(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error desactivando el Compensatorio' });
  }
};

export default {
  getAllCompensatorios,
  createCompensatorio,
  getCompensatorioById,
  updateCompensatorio,
  deleteCompensatorio,
  getCompensatorioByArea,
  getCompensatorios
};