import { DateTime } from "luxon";

// Obtener fecha en formato deseado
function getDate(value = null) {
    const date = (value)
        ? DateTime.fromISO(value)
        : DateTime.now();

    return date.toLocaleString(DateTime.DATE_MED);
}

// Obtener hora en formato deseado
function getTime(value = null) {
    const date = (value)
        ? DateTime.fromISO(value)
        : DateTime.now();

    return date.toLocaleString(DateTime.TIME_24_SIMPLE);
}

// Obtener fecha y hora
function getDateTime(value) {
    const date = (value)
        ? DateTime.fromISO(value)
        : DateTime.now();

    return date.toLocaleString(DateTime.DATETIME_SHORT);
}

export {
    getDate,
    getDateTime,
    getTime
}