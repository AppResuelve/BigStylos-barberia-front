export default function obtainMonthName(monthNumber) {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  // Restar 1 porque los arrays en JavaScript son base 0
  return monthNames[monthNumber - 1];
}
