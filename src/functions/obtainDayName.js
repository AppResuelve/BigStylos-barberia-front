function obtainDayName(day, month, year) {
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
  const date = new Date(year, month - 1, day - 1); // Meses en JavaScript son de 0 a 11

  return daysOfWeek[date.getDay()];
}

export default obtainDayName;
