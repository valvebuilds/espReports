import { time } from 'console';
import { parseISO, getDay, isBefore, isAfter, differenceInMinutes } from 'date-fns';

const normalizeToTime = (dateTime) => {
    // Retorna una estructura simple para comparación solo de hora y minuto
    const date = parseISO(dateTime.toISOString());
    return {
        fecha: date.getDate(),
        mes: date.getMonth(),
        diaSemana: mapDayToEnum(date.getDay()),
        horas: date.getHours(), 
        minutos: date.getMinutes() 
    };
};

const esFestivo = (fecha) => {
  const festivos = [
    '2025-01-01',
    '2025-05-01',
    '2025-12-25'
    // ... más festivos
  ];
  const f = fecha.toISOString().split('T')[0];
  return festivos.includes(f);
};
const parseHora = (fechaBase, horaStr) => {
  const [h, m] = horaStr.split(':').map(Number);
  const d = new Date(fechaBase);
  d.setHours(h, m, 0, 0);
  return d;
}

function getDiaSemana(fecha) {
  const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  return dias[fecha.getDay()];
}

const milisecToHours = (milisegundos) =>{
    const minutes = milisegundos/60000
    return minutes/60
}
const diffEnHoras = (inicio, fin) => {
  return (fin - inicio) / (1000 * 60 * 60);
}
export default {
    normalizeToTime,
    parseHora,
    getDiaSemana,
    diffEnHoras,
    milisecToHours,
    esFestivo
    
}