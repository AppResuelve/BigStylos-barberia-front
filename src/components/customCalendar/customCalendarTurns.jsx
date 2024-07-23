import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { Box } from "@mui/material";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import "./customCalendar.css";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomCalendarTurns = ({
  sm,
  setIsOpen,
  days,
  dayIsSelected,
  setDayIsSelected,
  serviceSelected,
  selectedWorker,
}) => {
  const { darkMode, setShowAlert } = useContext(DarkModeContext);
  const daysCalendarCustom = daysMonthCalendarCustom(27, true);
  const { currentMonth, nextMonth, currentYear, nextYear, month1, month2 } =
    daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday() == 0 ? 7 : getToday();
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

  const getTime = async (day, month) => {
    setDayIsSelected([day, month]);
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/workdays/dayforturns`,
        {
          dayForTurns: [day, month],
          worker: selectedWorker.email,
          service: serviceSelected,
        }
      );
      const { data } = response;
      console.log(data, "este es el data");
    } catch (error) {
      console.error("Error al obtener los horarios", error);
      alert("Error al obtener los horarios");
    }
  };
  // if (Object.keys(user).length > 0 && user.phone === "") {
  //   setShowAlert({
  //     isOpen: true,
  //     message: "Por única vez debes ingresar tu numero de celular",
  //     type: "info",
  //     button1: {
  //       text: "aceptar",
  //       action: "submit",
  //     },
  //     buttonClose: {
  //       text: "phone",
  //     },
  //   });
  // } else if (Object.keys(user).length > 0 && user.isDelete === false) {
  //   setIsOpen(true);
  // } else if (user.isDelete === true) {
  //   setShowAlert({
  //     isOpen: true,
  //     message: "Has sido inhabilitado por incumplir las normas",
  //     type: "error",
  //     button1: {
  //       text: "",
  //       action: "",
  //     },
  //     buttonClose: {
  //       text: "aceptar",
  //     },
  //   });
  // } else if (user === false) {
  //   setShowAlert({
  //     isOpen: true,
  //     message: "Debes estar loggeado para agendar un turno",
  //     type: "warning",
  //     button1: {
  //       text: "login",
  //       action: "login",
  //     },
  //     buttonClose: {
  //       text: "cancelar",
  //     },
  //   });
  // }

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Box className={"line7day-query600px"}>
          {daysOfWeek.map((day) => (
            <h4
              key={day}
              style={{ color: darkMode.on ? "white" : darkMode.dark }}
            >
              {day}
            </h4>
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
                onClick={() => getTime(day, currentMonth)}
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
                onClick={() => getTime(day, nextMonth)}
                disabled={disable}
                style={{
                  gridColumnStart:
                    month1.length < 1 && index === 0 ? getDayPosition : "auto",
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
      </Box>
    </>
  );
};

export default CustomCalendarTurns;
