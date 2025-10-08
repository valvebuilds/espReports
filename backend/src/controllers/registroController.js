import registroService from "../services/registroService.js";

//Obtener todas las Registros 
const getAllRegistros = async (req, res) => {
  try {
    const registros = await registroService.getAllRegistros();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Registros' });
  }
};
//Crear Registro
const createRegistro = async (req, res) => {
  try {
    const registro = await registroService.createRegistro(req.body);
    res.status(201).json(registro);
  } catch (error) {
    res.status(400).json({ error: 'Error creando Registro' });
  }
};
//Obtener Registro por id
const getRegistroById = async (req, res) => {
    try {
        const registro = await registroService.getRegistroById(req.params.id);
        if (registro) {
            res.json(registro);
        } else {
        res.status(404).json({ error: 'No se encontró el Registro' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Registro' });
    }
};
//Actualizar Registro
const updateRegistro = async (req, res) => {
  try {
    const registroActualizado = await registroService.updateRegistro(req.params.id, req.body);
    res.json(registroActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de Registro' });
  }
};
// Desactivar Registro (en vez de eliminarlo)
const deleteRegistro = async (req, res) => {
  try {
    await registroService.deleteRegistro(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error desactivando el Registro' });
  }
};

export default {
  getAllRegistros,
  createRegistro,
  getRegistroById,
  updateRegistro,
  deleteRegistro,
};