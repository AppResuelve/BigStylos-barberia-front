import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import { Box } from "@mui/material";
import "./customCalendar.css";

const CustomCalendarTurns = ({
  sm,
  days,
  dayIsSelected,
  setDayIsSelected,
  amountOfDays,
  serviceSelected,
}) => {
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, true);
  const { currentMonth, nextMonth } = daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday(); // devuelve número que representa qué día de la semana es (lunes, martes, etc)

  /* console.log(days) */

  const handleDay = (day, month) => {
    setDayIsSelected((prevState) => {
      let newState = { ...prevState };
      if (prevState[1] == month && prevState[0] == day) {
        newState = [];
      } else {
        newState = [day, month];
      }
      return newState;
    });
  };
  return (
    <div className="div-container-calendar">
      <Box className={!sm ? "line7day-query600px" : "line7day"}>
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </Box>
      <Box className={!sm ? "line7-query600px" : "line7"}>
        {daysCalendarCustom.month1.map((day, index) => {
          let colorDay = "white"; // Inicializar colorDay fuera del mapeo
          let disable = true;
          if (days[currentMonth] && days[currentMonth][day]) {
            disable = false;
          }
          if (days[currentMonth] && days[currentMonth][day]) {
            colorDay = "#5bfd33d0";
          }

          return (
            <button
              key={index}
              className="month1"
              onClick={() => handleDay(day, currentMonth)}
              disabled={disable}
              style={{
                gridColumnStart: index === 0 ? getDayPosition : "auto",
                backgroundColor:
                  dayIsSelected.length > 0 &&
                  dayIsSelected[0] == day &&
                  dayIsSelected[1] == currentMonth
                    ? "#2196f3"
                    : colorDay,
              }}
            >
              {day}
            </button>
          );
        })}

        {daysCalendarCustom.month2.map((day, index) => {
          let colorDay = "white"; // Inicializar colorDay fuera del mapeo
          let disable = true;
          if (days[nextMonth] && days[nextMonth][day]) {
            disable = false;
          }
          if (days[nextMonth] && days[nextMonth][day]) {
            colorDay = "#5bfd33d0";
          }

          return (
            <button
              key={index + 100}
              className="month2"
              onClick={() => handleDay(day, nextMonth)}
              disabled={disable}
              style={{
                backgroundColor:
                  dayIsSelected.length > 0 &&
                  dayIsSelected[0] == day &&
                  dayIsSelected[1] == nextMonth
                    ? "#2196f3"
                    : colorDay,
              }}
            >
              {day}
            </button>
          );
        })}
      </Box>
    </div>
  );
};

export default CustomCalendarTurns;
