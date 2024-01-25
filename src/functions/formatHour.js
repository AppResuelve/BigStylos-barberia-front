function formatHour(minutes) {
    const hours = Math.floor(minutes / 60); // cuantas horas hay
    const remainingMinutes = minutes % 60; // cuantos minutos me quedan

    const formattedHours = hours < 10 ? '0' + hours : hours; // si la hora es menor a 2 digitos le agrega un 0 al inicio
    const formattedMinutes = remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes;

    const hourFormat = `${formattedHours}:${formattedMinutes}`; // crea el string con el formato

    return hourFormat;
}

export default formatHour;