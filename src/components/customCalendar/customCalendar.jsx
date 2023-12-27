import { useEffect, useState } from "react";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import axios from "axios";
import "./customCalendar.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomCalendar = ({ setDayIsSelected }) => {
  const daysCalendarCustom = daysMonthCalendarCustom(21, false);
  let { currentMonth, nextMonth } = daysCalendarCustom;
  console.log(currentMonth, nextMonth);
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday(); // devuelve número que representa qué día de la semana es (lunes, martes, etc)
  const [typeOfDays, setTypeOfDays] = useState({}); //devuelve ej: {12:{15:"toUpdate"},12:{16:"warningUpdate"}}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/workdays/getdays`
        );
        const { data } = response;
        console.log(data);
        setTypeOfDays(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchData();
  }, []);

  const handleDay = (event) => {
    setDayIsSelected(event.target.value);
  };

  return (
    <div>
      <h1>calendario</h1>
      <div className="line7day">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="line7">
        {daysCalendarCustom.month1.map((day, index) => {
          let colorDay; // Inicializar colorDay fuera del mapeo

          if (!typeOfDays[currentMonth] || !typeOfDays[currentMonth][day]) {
            colorDay = "gray";
          } else if (
            typeOfDays[currentMonth] &&
            typeOfDays[currentMonth][day] === "toUpdate"
          ) {
            colorDay = "green";
          } else {
            colorDay = "red";
          }

          return (
            <button
              key={index}
              className="month1"
              value={{
                colorDay: colorDay,
                currentDay: day,
              }}
              onClick={handleDay}
              style={{
                gridColumnStart: index === 0 ? getDayPosition : "auto",
                ...(index === 0 ? { backgroundColor: "#e0e0e0" } : {}),
                backgroundColor: colorDay, // Asignar colorDay al backgroundColor
              }}
            >
              {day}
            </button>
          );
        })}

        {daysCalendarCustom.month2.map((day, index) => {
          let colorDay; // Inicializar colorDay fuera del mapeo

          if (!typeOfDays[nextMonth] || !typeOfDays[nextMonth][day]) {
            colorDay = "gray";
          } else if (
            typeOfDays[nextMonth] &&
            typeOfDays[nextMonth][day] === "toUpdate"
          ) {
            colorDay = "green";
          } else {
            colorDay = "red";
          }

          return (
            <button
              key={index + 100}
              className="month2"
              value={{
                colorDay: colorDay,
                currentDay: day,
              }}
              onClick={handleDay}
              style={{
                backgroundColor: colorDay, // Asignar colorDay al backgroundColor
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

export default CustomCalendar;

/* {
    "_id": "6584df2bde76b1133c244c87",
    "date": "11/08/1990" 
  } */
