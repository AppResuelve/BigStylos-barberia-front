import { useEffect, useState } from "react";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import { useAuth0 } from "@auth0/auth0-react";
import getToday from "../../functions/getToday";
import axios from "axios";
import "./customCalendar.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomCalendarTurns = ({
  daysForCalendar,
  setDayIsSelected,
  amountOfDays,
}) => {
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, false);
  // const { user } = useAuth0(); // Obtener el usuario actual
  const { currentMonth, nextMonth } = daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday(); // devuelve número que representa qué día de la semana es (lunes, martes, etc)
  useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await axios.get(
    //           `${VITE_BACKEND_URL}/workdays/getdays`
    //         );
    //         const { data } = response;
    //         setTypeOfDays(data);
    //       } catch (error) {
    //         console.error("Error al obtener los dias:", error);
    //         alert("Error al obtener los dias");
    //       }
    //     };
    //     fetchData();
  }, []);

  const handleDay = (day) => {
   setDayIsSelected((prevState) => ({
     ...prevState,
     currentDay: day,
   }));
  };
  console.log(daysForCalendar);
  return (
    <div>
      <h1>Calendario de turnos</h1>
      <div className="line7day">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="line7">
        {daysCalendarCustom.month1.map((day, index) => {
          let colorDay = "white"; // Inicializar colorDay fuera del mapeo
          let disabled = true;
          if (
            daysForCalendar[currentMonth] &&
            daysForCalendar[currentMonth][day] === "se puede agendar"
          ) {
            colorDay = "gray";
            disabled = false;
          } else if (
            daysForCalendar[currentMonth] &&
            daysForCalendar[currentMonth][day] === "no se puede agendar"
          ) {
            colorDay = "white";
            disabled = true;
          }

          return (
            <button
              key={index}
              className="month1"
              disabled={disabled}
              onClick={() => handleDay(day)}
              style={{
                gridColumnStart: index === 0 ? getDayPosition : "auto",
                ...(index === 0 ? { backgroundColor: "#e0e0e0" } : {}),
                backgroundColor: colorDay, // Asignar colorDay al backgroundColor
                cursor: disabled ? "auto" : "pointer",
              }}
            >
              {day}
            </button>
          );
        })}

        {daysCalendarCustom.month2.map((day, index) => {
          let colorDay = "white"; // Inicializar colorDay fuera del mapeo
          let disabled = true;

          if (
            daysForCalendar[nextMonth] &&
            daysForCalendar[nextMonth][day] === "se puede agendar"
          ) {
            colorDay = "gray";
            disabled = false;
          } else if (
            daysForCalendar[nextMonth] &&
            daysForCalendar[nextMonth][day] === "no se puede agendar"
          ) {
            colorDay = "white";
            disabled = true;
          }

          return (
            <button
              key={index + 100}
              className="month2"
              disabled={disabled}
              onClick={() => handleDay(day)}
              style={{
                backgroundColor: colorDay, // Asignar colorDay al backgroundColor
                cursor: disabled ? "auto" : "pointer",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendarTurns;
