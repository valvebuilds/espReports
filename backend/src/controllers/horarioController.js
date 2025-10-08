import horarioService from "../services/horarioService.js";

//Obtener todas las Horarios 
const getAllHorarios = async (req, res) => {
  try {
    const horarios = await horarioService.getAllHorarios();
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo Horarios' });
  }
};
//Crear Horario
const createHorario = async (req, res) => {
  try {
    const horario = await horarioService.createHorario(req.body);
    res.status(201).json(horario);
  } catch (error) {
    res.status(400).json({ error: 'Error creando Horario' });
  }
};
//Obtener Horario por id
const getHorarioById = async (req, res) => {
    try {
        const horario = await horarioService.getHorarioById(req.params.id);
        if (horario) {
            res.json(horario);
        } else {
        res.status(404).json({ error: 'No se encontró el Horario' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el Horario' });
    }
};
//Actualizar Horario
const updateHorario = async (req, res) => {
  try {
    const horarioActualizado = await horarioService.updateHorario(req.params.id, req.body);
    res.json(horarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando datos de Horario' });
  }
};
// Desactivar Horario (en vez de eliminarlo)
const deleteHorario = async (req, res) => {
  try {
    await horarioService.deleteHorario(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error desactivando el Horario' });
  }
};
//Obtener horarios de un turno (ej: DIURNO, NOCTURNO, FIN DE SEMANA)
const getHorarioByTurno = async (req, res) => {
   try {
        const horarios = await horarioService.getHorarioByTurno(Number(req.params.turnoId));
        res.json(horarios);
   } catch (error) {
        res.status(400).json({ error: "Error obteniendo horarios del turno" });
   }
}

export default {
  getAllHorarios,
  createHorario,
  getHorarioById,
  updateHorario,
  deleteHorario,
  getHorarioByTurno
};