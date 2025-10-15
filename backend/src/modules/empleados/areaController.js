import areaService from './areaService.js';

//Obtener todas las Areas 
const getAllAreas = async (req, res) => {
  try {
    const areas = await areaService.getAllAreas();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Áreas' });
  }
};
//Crear Area
const createArea = async (req, res) => {
  try {
    const Area = await areaService.createArea(req.body);
    
    res.status(201).json(Area);
  } catch (error) {
    res.status(400).json({ error: 'Error creando Área' });
  }
};
//Actualizar Area
const updateArea = async (req, res) => {
  try {
    const areaActualizado = await areaService.updateArea(req.params.id, req.body);
    res.json(areaActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de Área' });
  }
};
// Desactivar Area (en vez de eliminarlo)
const deleteArea = async (req, res) => {
  try {
    await areaService.deleteArea(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error desactivando al Área' });
  }
};
//Obtener Area por id
const getAreaById = async (req, res) => {
    try {
        const Area = await areaService.getAreaById(req.params.id);
        if (Area) {
            res.json(Area);
        } else {
        res.status(404).json({ error: 'No se encontró el Área' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Área' });
    }
};
export default {
  getAllAreas,
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
};