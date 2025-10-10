import { time } from 'console';
import { parseISO, getDay, isBefore, isAfter, differenceInMinutes } from 'date-fns';

const normalizeToTime = (dateTime) => {
    // Retorna una estructura simple para comparación solo de hora y minuto
    const date = parseISO(dateTime.toISOString());
    return {
        fecha: date.getDate(),
        dia: mapDayToEnum(date.getDay()),
        horas: date.getHours(), 
        minutos: date.getMinutes() 
    };
}

const stringHorasMinutos = (timeString) =>{
    const [horas, minutos] = timeString.split(':');
    return {
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10)
  };
}

const mapDayToEnum = (diaNumero) => {
    const diaSemanaMap = [
        'DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'
    ];
    return diaSemanaMap[diaNumero];
}

export default {
    normalizeToTime,
    stringHorasMinutos,
    mapDayToEnum,
}