import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import { Box } from "@mui/material";
import "./customCalendar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import obtainDayName from "../../functions/obtainDayName";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomCalendarTurns = ({
  sm,
  days,
  dayIsSelected,
  setDayIsSelected,
  amountOfDays,
  serviceSelected,
  setIsOpen,
}) => {
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, true);
  const { currentMonth, nextMonth, currentYear, nextYear } = daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday() - 1; // devuelve número que representa qué día de la semana es (lunes, martes, etc)
  const [schedule, setSchedule] = useState({});
  const [noWork, setNoWork] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule`);
        const { data } = response;
        setSchedule(data.businessSchedule);
        setNoWork(data.noWorkDays);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchData();
  }, []);

  const handleDay = (day, month) => {
    setIsOpen(true);
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
      <Box className={"line7day-query600px"}>
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </Box>
      <Box className={"line7-query600px"}>
        {daysCalendarCustom.month1.map((day, index) => {
          let dayName = obtainDayName(day, currentMonth, currentYear);
          let colorDay = "#e8e8e8"; // Inicializar colorDay fuera del mapeo
          let disable = true;
          if (days[currentMonth] && days[currentMonth][day]) {
            disable = false;
            colorDay = "#5bfd33d0";
          }
          if (noWork[currentMonth] && noWork[currentMonth][day]) {
            disable = true;
            colorDay = "gray";
          }
          if (
            !schedule[dayName] ||
            (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
          ) {
            disable = true;
            colorDay = "gray";
          }

          return (
            <button
              key={index}
              className={disable ? "month1-false" : "month1"}
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
                color: disable
                  ? "#9f9f9f"
                  : dayIsSelected.length > 0 &&
                    dayIsSelected[0] == day &&
                    dayIsSelected[1] == currentMonth
                  ? "white"
                  : "",
                fontSize:
                  dayIsSelected.length > 0 &&
                  dayIsSelected[0] == day &&
                  dayIsSelected[1] == currentMonth
                    ? "25px"
                    : "",
                cursor: disable ? "" : "pointer",
              }}
            >
              {day}
            </button>
          );
        })}

        {daysCalendarCustom.month2.map((day, index) => {
          let dayName = obtainDayName(day, nextMonth, nextYear);
          let colorDay = "#e8e8e8"; // Inicializar colorDay fuera del mapeo
          let disable = true;
          if (days[nextMonth] && days[nextMonth][day]) {
            disable = false;
            colorDay = "#5bfd33d0";
          }
          if (noWork[nextMonth] && noWork[nextMonth][day]) {
            disable = true;
            colorDay = "gray";
          }

          if (
            !schedule[dayName] ||
            (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
          ) {
            disable = true;
            colorDay = "gray";
          }

          return (
            <button
              key={index + 100}
              className={disable ? "month2-false" : "month2"}
              onClick={() => handleDay(day, nextMonth)}
              disabled={disable}
              style={{
                backgroundColor:
                  dayIsSelected.length > 0 &&
                  dayIsSelected[0] == day &&
                  dayIsSelected[1] == nextMonth
                    ? "#2196f3"
                    : colorDay,
                color: disable
                  ? "#727591"
                  : dayIsSelected.length > 0 &&
                    dayIsSelected[0] == day &&
                    dayIsSelected[1] == nextMonth
                  ? "white"
                  : "",
                fontSize:
                  dayIsSelected.length > 0 &&
                  dayIsSelected[0] == day &&
                  dayIsSelected[1] == nextMonth
                    ? "20px"
                    : "",
                cursor: disable ? "" : "pointer",
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
