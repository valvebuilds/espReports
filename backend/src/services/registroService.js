import prisma from '../prisma/prismaClient.js';
import parametroService from './parametroService.js';
import timeParser from '../utils/timeParser.js';
import { interval, parseISO } from 'date-fns';
import horarioService from './horarioService.js';

//Obtener todos los Registros activos
const getAllRegistros = async () => {
  return await prisma.registro.findMany();
};
//Crear Registro
const createRegistro = async (data) => {
  return await prisma.registro.create({ data });
};


const calcularHorasExtra = async (data) =>{
  const { horaInicio, horaFin, turnoId } = data;
  const { recargos } = await parametroService.getAllParametros;
  const { horariosTurno } = await horarioService.getHorarioByTurno(turnoId);

   if (horariosTurno.length === 0) {
        throw new Error(`No se encontraron horarios activos para el Turno con ID: ${turnoId}`);
    }
    const [fechaIniRegistro, diaIniRegistro, horasIniRegistro, minutosIniRegistro] = timeParser.normalizeToTime(horaInicio);
    const [fechaFinRegistro, diaFinRegistro, horasFinRegistro, minutosFinRegistro] = timeParser.normalizeToTime(horaFin);

    /*if (esFestivo(fechaInicio) || diaInicio == 'DOMINGO'){

    }
    if (esFestivo(fechaFin) || diaFin == 'DOMINGO'){

    }*/
   const horariosNormal = horariosTurno.find(h => h.diaSemana === diaInicio||diaFin);
  
   if (!horariosNormal) {
        console.warn(`No se encontró horario normal para el día ${diaSemanaPrisma}. Asumiendo todo como extra.`);}
    
   /* for ( intervalo in horariosNormal ) {
      const turnoEmpieza = timeParser.stringHorasMinutos(intervalo.horaInicio);
      const turnoTermina = timeParser.stringHorasMinutos(intervalo.horaFin);

      if ( horasIniRegistro < turnoEmpieza || horasIniRegistro)
    }*/
}
//Obtener Registro por id
const getRegistroById = async (id) => {
  return await prisma.registro.findUnique({ where: { id: id } });
};
//Actualizar Registro
const updateRegistro = async (id, data) => {
  return await prisma.registro.update({ where: { id: id }, data });
};
// Desactivar Registro (en vez de eliminarlo)
const deleteRegistro = async (id) => {
  return await prisma.registro.delete({ where: { id: id },});
};



export default {
  getAllRegistros,
  createRegistro,
  getRegistroById,
  updateRegistro,
  deleteRegistro,
};