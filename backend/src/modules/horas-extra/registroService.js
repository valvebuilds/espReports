import prisma from '../../shared/prisma/prismaClient.js';
import timeParser from '../../shared/utils/timeParser.js';
import { interval, parseISO } from 'date-fns';
import horarioService from '../horarios/horarioService.js';

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
  if (horaInicio >= horaFin) {
    throw new Error('La hora de inicio no puede ser mayor o igual a la hora de fin');
  }
  // Traer parámetros y horarios desde la base de datos
  const horariosTurno = await horarioService.getHorarioByTurno(turnoId);

  if (horariosTurno.length === 0) {
    throw new Error(`No se encontraron horarios activos para el Turno con ID: ${turnoId}`);
  }

  const diaInicio = timeParser.getDiaSemana(horaInicio);
  const diaFin = timeParser.getDiaSemana(horaFin);

  // Filtrar los horarios correspondientes a los días del registro
  const horariosDiaInicio = horariosTurno.filter(h => h.diaSemana === diaInicio);
  const horariosDiaFin = horariosTurno.filter(h => h.diaSemana === diaFin);

  let minutosExtraDiurnos = 0;
  let minutosExtraNocturnos = 0;
  let minutosExtraDominicales = 0;  
  
// 📌 Función interna para procesar un día
  function procesarDia(horaIni, horaFinal, horariosDia) {
  let horaActual = new Date(horaIni);

  while (horaActual < horaFinal) {
    const dentroHorario = horariosDia.some(intervalo => {
      const t1 = timeParser.parseHora(horaActual, intervalo.horaInicio);
      const t2 = timeParser.parseHora(horaActual, intervalo.horaFin);
      return horaActual >= t1 && horaActual < t2;
    });

    if (!dentroHorario) {
      const hora = horaActual.getHours();
      const esNocturna = (hora >= 19 || hora < 6);
      const esDomingo = timeParser.getDiaSemana(horaActual) === 'DOMINGO';
      const esFestivoDia = timeParser.esFestivo(horaActual);

      if (esDomingo || esFestivoDia) {
        minutosExtraDominicales += 1;
      } else if (esNocturna) {
        minutosExtraNocturnos += 1;
      } else {
        minutosExtraDiurnos += 1;
      }
    }

    horaActual.setMinutes(horaActual.getMinutes() + 1);
  }
}
 
  // 📌 Si el registro ocurre en un solo día
  if (horaInicio.toDateString() === horaFin.toDateString()) {
    procesarDia(horaInicio, horaFin, horariosDiaInicio);
  } else {
    // Caso cuando cruza la medianoche
    const finDia = new Date(horaInicio);
    finDia.setHours(23, 59, 59, 999);

    const inicioSiguienteDia = new Date(horaFin);
    inicioSiguienteDia.setHours(0, 0, 0, 0);
    console.log(inicioSiguienteDia.toLocaleString(), horaFin.toLocaleString(), horariosDiaFin);
    procesarDia(horaInicio, finDia, horariosDiaInicio);
    procesarDia(inicioSiguienteDia, horaFin, horariosDiaFin);
    
  }
  const horasExtraDiurnas = minutosExtraDiurnos / 60;
  const horasExtraNocturnas = minutosExtraNocturnos / 60;
  const horasExtraDominicales = minutosExtraDominicales / 60;

  const totalHorasExtra = horasExtraDiurnas + horasExtraNocturnas + horasExtraDominicales;  
    return {
      totalHorasExtra: Number(totalHorasExtra.toFixed(2)),
      diurnas: Number(horasExtraDiurnas.toFixed(2)),
      nocturnas: Number(horasExtraNocturnas.toFixed(2)),
      dominicales: Number(horasExtraDominicales.toFixed(2))
    };
};
const dummyData = {
  horaInicio: new Date('2025-10-14T19:00:00'),
  horaFin: new Date('2025-10-15T05:00:00'),
  turnoId: 1
};

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