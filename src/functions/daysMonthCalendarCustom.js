function daysMonthCalendarCustom(totalDays, boolean) {
  function getDaysInMonth(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  }
  const currentDate = new Date(); // 2023-12-24T04:08:26.490Z
  const currentYear = currentDate.getFullYear(); // 2023
  const currentMonth = currentDate.getMonth() + 1; // 12

  const daysCurrentMonth = getDaysInMonth(currentYear, currentMonth); // dias del mes actual en un array
  const daysNextMonth = getDaysInMonth(currentYear, currentMonth + 1); // dias del mes siguiente en un array

  const currentDay = new Date().getDate(); // dia actual 24

  const remaining = daysCurrentMonth.filter((dia) => {
    // devuelve array con los dias del mes que sean mayores al actual
    if (boolean === true) {
      return dia >= currentDay;
    }
    return dia > currentDay;
  });

  if (remaining.length > totalDays) {
    const resultMonth1 = remaining.slice(0, totalDays);
    const result1 = {
      month1: resultMonth1,
      month2: [],
      currentMonth: currentMonth,
      nextMonth: currentMonth === 12 ? 1 : currentMonth + 1,
      currentYear: currentYear,
      nextYear: currentMonth === 12 ? currentYear + 1 : currentYear,
    };
    return result1;
  }

  const combinedMonth = [...remaining, ...daysNextMonth]; // unifica el array de dias del mes actual con los del proximo
  const combinedMonthSlice = combinedMonth.slice(0, totalDays); // obtiene la cantidad de dias especificados del mes actual y toma los del dia proximo si no le alcanza
  const remainingNext = combinedMonthSlice.slice(
    remaining.length,
    combinedMonthSlice.length
  );
  const result = {
    month1: remaining,
    month2: remainingNext,
    currentMonth: currentMonth,
    nextMonth: currentMonth === 12 ? 1 : currentMonth + 1,
    currentYear: currentYear,
    nextYear: currentMonth === 12 ? currentYear + 1 : currentYear,
  };

  //la funcion devuelve un objeto con 2 arrays
  //array 1 corresponde a los numeros de dias restantes del mes acual
  //arra2 2 corresponde a los numeros de dias restantes del mes proximo
  //la funcion requiere 2 parametros
  //parametro 1 = numero de dias que quieres que devuelva. entre los 2 meses
  //parametro 2 = true o false si quieres que incluya el dia actual

  return result;
}

export default daysMonthCalendarCustom;
