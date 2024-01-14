function getToday() {
    const today = new Date();
const dayOfWeek = today.getDay() +1;

// si es lunes devuelve 1, si es martes devulevle 2, etc...
return dayOfWeek
}

export default getToday;