import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import { Box } from "@mui/material";
import "./customCalendar.css";
import { useState } from "react";

const CustomCalendarPlannedC = ({
  schedule,
  noWork,
  amountOfDays,
  dayIsSelected,
  setDayIsSelected,
  showEdit,
  days,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, false);
  let { currentMonth, nextMonth, currentYear, nextYear, month1, month2 } =
    daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday() + 1;
  const [hasTurnInSelectedDay, setHasTurnInSelectedDay] = useState(false);

  const handleDay = (day, month) => {
    if (dayIsSelected && dayIsSelected[month] && dayIsSelected[month][day]) {
        // Si ya existe en dayIsSelected, lo quitamos
        setDayIsSelected((prevState) => {
            const newState = { ...prevState };
            const { [day]: _, ...restDays } = newState[month];

            if (Object.keys(restDays).length === 0) {
                // Si no quedan más días en ese mes, eliminamos el mes
                delete newState[month];
            } else {
                // Si aún quedan días en el mes, actualizamos el mes
                newState[month] = restDays;
            }

            // Actualizamos el estado de hasTurnInSelectedDay si el día removido tenía un turno
            if (days[month][day] && days[month][day].turn) {
                setHasTurnInSelectedDay(false);
            }

            return newState;
        });
    } else {
        if (days && days[month] && days[month][day] && days[month][day].turn) {
            // Si el día tiene turn = true, sobrescribimos el estado con el nuevo valor
            setDayIsSelected({
                [month]: {
                    [day]: {}, // Puedes agregar aquí cualquier dato que desees almacenar para ese día
                },
            });

            // Indicamos que el nuevo día seleccionado tiene un turno
            setHasTurnInSelectedDay(true);
        } else {
            // Si el día que se va a agregar no tiene turno, pero ya hay un día con turno en el estado, sobrescribimos
            if (hasTurnInSelectedDay) {
                setDayIsSelected({
                    [month]: {
                        [day]: {}, // Puedes agregar aquí cualquier dato que desees almacenar para ese día
                    },
                });

                // El nuevo día no tiene turno, así que desactivamos el flag
                setHasTurnInSelectedDay(false);
            } else {
                // Si no existe, lo agregamos sin sobrescribir el estado anterior
                setDayIsSelected((prevState) => ({
                    ...prevState,
                    [month]: {
                        ...prevState[month],
                        [day]: {}, // Puedes agregar aquí cualquier dato que desees almacenar para ese día
                    },
                }));
            }
        }
    }
};
  
  

  return (
    <div className="div-container-calendar">
      <Box className="line7day-query600px">
        {daysOfWeek.map((day) => (
          <h4
            key={day}
            style={{ color: darkMode.on ? "white" : darkMode.dark }}
          >
            {day}
          </h4>
        ))}
      </Box>

      <Box className="line7-query600px">
        {daysCalendarCustom.month1.map((day, index) => {
          let dayName = obtainDayName(day, currentMonth, currentYear);
          let disabled = false;
          let colorDay = "#e0e0e0d2";
          let turn = false;
          if (
            days &&
            days[currentMonth] &&
            days[currentMonth][day] &&
            days[currentMonth][day].turn
          ) {
            turn = true;
            colorDay = "#e6b226d0";
          }
          if (
            !schedule[dayName] ||
            (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
          ) {
            disabled = true;
            colorDay = "gray";
          }
          if (noWork[currentMonth] && noWork[currentMonth][day]) {
            colorDay = "gray";
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
                    ? "gray"
                    : colorDay,
                cursor: !showEdit
                  ? "not-allowed"
                  : disabled
                  ? "auto"
                  : "pointer",
                color: disabled
                  ? "#e0e0e0d2"
                  : !showEdit
                  ? "white"
                  : dayIsSelected[currentMonth] &&
                    dayIsSelected[currentMonth][day]
                  ? "white"
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
          if (noWork[nextMonth] && noWork[nextMonth][day]) {
            colorDay = "gray";
          }
          return (
            <button
              key={index + 100}
              disabled={!showEdit ? true : disabled}
              className={!showEdit || disabled ? "month2-false" : "month2"}
              onClick={() => handleDay(day, nextMonth)}
              style={{
                gridColumnStart:
                  month1.length < 1 && index === 0 ? getDayPosition : "auto",
                backgroundColor: colorDay,
                ...(dayIsSelected[nextMonth] && dayIsSelected[nextMonth][day]
                  ? { backgroundColor: "gray" }
                  : {}),
                cursor: !showEdit
                  ? "not-allowed"
                  : disabled
                  ? "auto"
                  : "pointer",
                color: disabled
                  ? "#e0e0e0d2"
                  : !showEdit
                  ? "white"
                  : dayIsSelected[nextMonth] && dayIsSelected[nextMonth][day]
                  ? "white"
                  : "#2231a3",
              }}
            >
              {day}
            </button>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          marginTop: "12px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
          <div
            style={{
              height: "18px",
              width: "18px",
              backgroundColor: "#e6b226d0",
              borderRadius: "25px",
            }}
          ></div>
          <h4
            style={{
              color: darkMode.on ? "white" : darkMode.dark,
              marginLeft: "4px",
              letterSpacing: "1px",
            }}
          >
            Con reserva/s
          </h4>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
          <div
            style={{
              height: "18px",
              width: "18px",
              backgroundColor: "gray",
              borderRadius: "25px",
            }}
          ></div>
          <h4
            style={{
              color: darkMode.on ? "white" : darkMode.dark,
              marginLeft: "4px",
              letterSpacing: "1px",
            }}
          >
            No laborable
          </h4>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
          <div
            style={{
              height: "18px",
              width: "18px",
              backgroundColor: "#e0e0e0d2",
              borderRadius: "25px",
            }}
          ></div>
          <h4
            style={{
              color: darkMode.on ? "white" : darkMode.dark,
              marginLeft: "4px",
              letterSpacing: "1px",
            }}
          >
            Día hábil
          </h4>
        </Box>
      </Box>
    </div>
  );
};

export default CustomCalendarPlannedC;
