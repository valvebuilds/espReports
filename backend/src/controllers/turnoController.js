import turnoService from "../services/turnoService.js";

//Obtener todas las Turnos 
const getAllTurnos = async (req, res) => {
  try {
    const turnos = await turnoService.getAllTurnos();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Turnos' });
  }
};
//Crear Turno
const createTurno = async (req, res) => {
  try {
    const turno = await turnoService.createTurno(req.body);
    res.status(201).json(turno);
  } catch (error) {
    res.status(400).json({ error: 'Error creando Turno' });
  }
};
//Obtener Turno por id
const getTurnoById = async (req, res) => {
    try {
        const turno = await turnoService.getTurnoById(req.params.id);
        if (turno) {
            res.json(turno);
        } else {
        res.status(404).json({ error: 'No se encontró el Turno' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Turno' });
    }
};
//Actualizar Turno
const updateTurno = async (req, res) => {
  try {
    const turnoActualizado = await turnoService.updateTurno(req.params.id, req.body);
    res.json(turnoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de Turno' });
  }
};
// Desactivar Turno (en vez de eliminarlo)
const deleteTurno = async (req, res) => {
  try {
    await turnoService.deleteTurno(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error desactivando el Turno' });
  }
};

export default {
  getAllTurnos,
  createTurno,
  getTurnoById,
  updateTurno,
  deleteTurno,
};