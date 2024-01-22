import { useEffect, useState } from "react";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import "./customCalendar.css";
import { Box } from "@mui/material";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomCalendar = ({
  setDayIsSelected,
  amountOfDays,
  dayIsSelected,
  days,
  showEdit,
  setDays,
  schedule,
  loading,
}) => {
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, false);
  let { currentMonth, nextMonth, currentYear, nextYear } = daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday();
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [exist50, setExist50] = useState(false);
  const [noWork, setNoWork] = useState({});

  useEffect(() => {
    const fetchNoWorkDays = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/schedule/noworkdays`
        );
        const { data } = response;
        setNoWork(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchNoWorkDays();
  }, []);

  const handleDay = (day, month) => {
    if (dayIsSelected[month] && dayIsSelected[month][day]) {
      // Si ya existe en dayIsSelected, lo quitamos
      const { [day]: _, ...rest } = dayIsSelected[month];

      setDayIsSelected((prevState) => {
        const newState = { ...prevState, [month]: rest };

        if (Object.keys(rest).length < 1) {
          delete newState[month];
        }

        return newState;
      });
    } else {
      if (days[month] && days[month][day]) {
        // Si existe en days, limpiamos la información anterior y asignamos el nuevo valor
        setDayIsSelected({
          [month]: {
            [day]: {},
          },
        });
        setExist50(true);
      } else {
        // Si no existe en days ni en dayIsSelected, agregamos el nuevo día al estado local
        if (exist50 == true) {
          setDayIsSelected({
            [month]: {
              [day]: {},
            },
          });
          setExist50(false);
        }
        setDayIsSelected((prevState) => ({
          ...prevState,
          [month]: {
            ...prevState[month],
            [day]: {},
          },
        }));
      }
    }
  };

  return (
    <div className="div-container-calendar">
      <Box className={"line7day-query600px"}>
        {daysOfWeek.map((day) => (
          <h4 key={day}>{day}</h4>
        ))}
      </Box>

      <Box className={"line7-query600px"}>
        {daysCalendarCustom.month1.map((day, index) => {
          let dayName = obtainDayName(day, currentMonth, currentYear);
          let disabled = false;
          let colorDay = "#e0e0e0d2";
          if (
            !schedule[dayName] ||
            (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
          ) {
            disabled = true;
            colorDay = "gray";
          }
          if (days && days[currentMonth] && days[currentMonth][day]) {
            colorDay = "#5bfd33d0";
          }

          if (noWork[currentMonth] && noWork[currentMonth][day]) {
            disabled = true;
            colorDay = "gray";
          }
          if (
            days &&
            days[currentMonth] &&
            days[currentMonth][day] &&
            days[currentMonth][day].turn
          ) {
            colorDay = "#e6b226d0";
          }

          return (
            <button
              key={index}
              disabled={!showEdit ? true : disabled}
              className={!showEdit || disabled ? "month1-false" : "month1"}
              onClick={() => handleDay(day, currentMonth)}
              style={{
                gridColumnStart: index === 0 ? getDayPosition : "auto",
                backgroundColor:
                  dayIsSelected[currentMonth] &&
                  dayIsSelected[currentMonth][day]
                    ? "#2196f3"
                    : colorDay,
                cursor: loading
                  ? "not-allowed"
                  : !showEdit
                  ? "not-allowed"
                  : disabled
                  ? "auto"
                  : "pointer",
                color: !showEdit
                  ? "white"
                  : dayIsSelected[currentMonth] &&
                    dayIsSelected[currentMonth][day]
                  ? "white"
                  : days && days[currentMonth] && days[currentMonth][day]
                  ? "black"
                  : disabled
                  ? "#e0e0e0d2"
                  : "#000000",
              }}
            >
              {day}
            </button>
          );
        })}

        {daysCalendarCustom.month2.map((day, index) => {
          let dayName = obtainDayName(day, nextMonth, nextYear);
          let disabled = false;
          let colorDay = "#e0e0e0d2";
          if (
            !schedule[dayName] ||
            (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
          ) {
            disabled = true;
            colorDay = "gray";
          }
          if (days && days[nextMonth] && days[nextMonth][day]) {
            colorDay = "#5bfd33d0";
          }
          if (noWork[nextMonth] && noWork[nextMonth][day]) {
            disabled = true;
            colorDay = "gray";
          }
          if (
            days &&
            days[nextMonth] &&
            days[nextMonth][day] &&
            days[nextMonth][day].turn
          ) {
            colorDay = "#e6b226d0";
          }
          if (
            !schedule[dayName] ||
            (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
          ) {
            disabled = true;
            colorDay = "gray";
          }

          return (
            <button
              key={index + 100}
              className={!showEdit || disabled ? "month2-false" : "month2"}
              disabled={!showEdit ? true : disabled}
              onClick={() => handleDay(day, nextMonth)}
              style={{
                backgroundColor: colorDay,
                ...(dayIsSelected[nextMonth] && dayIsSelected[nextMonth][day]
                  ? { backgroundColor: "#2196f3" }
                  : {}),
                cursor: loading
                  ? "not-allowed"
                  : !showEdit
                  ? "not-allowed"
                  : disabled
                  ? "auto"
                  : "pointer",
                color: !showEdit
                  ? "white"
                  : dayIsSelected[nextMonth] && dayIsSelected[nextMonth][day]
                  ? "white"
                  : days && days[nextMonth] && days[nextMonth][day]
                  ? "black"
                  : disabled
                  ? "#e0e0e0d2"
                  : "#2231a3",
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

export default CustomCalendar;
