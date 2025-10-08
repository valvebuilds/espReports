import parametroService from "../services/parametroService.js";

//Obtener todas las Parametros 
const getAllParametros = async (req, res) => {
  try {
    const parametros = await parametroService.getAllParametros();
    res.json(parametros);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Parametros' });
  }
};
//Crear Parametro
const createParametro = async (req, res) => {
  try {
    const parametro = await parametroService.createParametro(req.body);
    res.status(201).json(parametro);
  } catch (error) {
    res.status(400).json({ error: 'Error creando Parametro' });
  }
};
//Obtener Parametro por id
const getParametroById = async (req, res) => {
    try {
        const parametro = await parametroService.getParametroById(req.params.id);
        if (parametro) {
            res.json(parametro);
        } else {
        res.status(404).json({ error: 'No se encontró el Parametro' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Parametro' });
    }
};
//Actualizar Parametro
const updateParametro = async (req, res) => {
  try {
    const parametroActualizado = await parametroService.updateParametro(req.params.id, req.body);
    res.json(parametroActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de Parametro' });
  }
};
// Desactivar Parametro (en vez de eliminarlo)
const deleteParametro = async (req, res) => {
  try {
    await parametroService.deleteParametro(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error desactivando el Parametro' });
  }
};

export default {
  getAllParametros,
  createParametro,
  getParametroById,
  updateParametro,
  deleteParametro,
};