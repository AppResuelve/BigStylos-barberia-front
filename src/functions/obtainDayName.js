function obtainDayName(day, month, year) {
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];
  const date = new Date(year, month - 1, day); // Meses en JavaScript son de 0 a 11

  return daysOfWeek[date.getDay()];
}

export default obtainDayName;
