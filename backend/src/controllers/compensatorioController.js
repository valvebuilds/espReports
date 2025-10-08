import compensatorioService from "../services/compensatorioService.js";

//Obtener todas las Compensatorios 
const getAllCompensatorios = async (req, res) => {
  try {
    const compensatorios = await compensatorioService.getAllCompensatorios();
    res.json(compensatorios);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Compensatorios' });
  }
};

const getCompensatorioByArea = async (req, res) => {
    try {
        console.log(req.coordinadorAreas);
        const area = req.coordinadorAreas;
        const compensatorios = await compensatorioService.getCompensatorioByArea();
        res.json(compensatorios);
    } catch (error) {
        res.status(500).json({ error: `Error obteniendo Compensatorios del área: ${area}` });
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
};