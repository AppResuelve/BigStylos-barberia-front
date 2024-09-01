import { useContext, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./customCalendar.css";

const CustomCalendarPlannedC = ({
  schedule,
  noWork,
  amountOfDays,
  dayIsSelected,
  setDayIsSelected,
  showEdit,
  days,
  toggle,
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
        delete newState[month][day];
        if (Object.keys(newState[month]).length === 0) {
          // Si no quedan más días en ese mes, eliminamos el mes
          delete newState[month];
        }
        return newState;
      });

      // Actualizamos el estado de hasTurnInSelectedDay si el día removido tenía un turno
      if (days[month] && days[month][day] && days[month][day].turn) {
        setHasTurnInSelectedDay(false);
      }
    } else {
      if (days[month] && days[month][day] && days[month][day].turn) {
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
      <Box className="line7day">
        {daysOfWeek.map((day) => (
          <h4
            key={day}
            style={{ color: darkMode.on ? "white" : darkMode.dark }}
          >
            {day}
          </h4>
        ))}
      </Box>

      <Box className="line7-calendar">
        {daysCalendarCustom.month1.map((day, index) => {
          let dayName = obtainDayName(day, currentMonth, currentYear);
          let disabled = false;
          let colorDay = "white";
          if (
            days &&
            days[currentMonth] &&
            days[currentMonth][day] &&
            days[currentMonth][day].turn
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
          if (noWork[currentMonth] && noWork[currentMonth][day]) {
            colorDay = "gray";
          }
          if (
            (toggle.remove && colorDay !== "gray") ||
            (toggle.add && colorDay !== "#e6b226d0" && colorDay !== "white")
          ) {
            disabled = true;
          }
          return (
            <div
              key={index}
              style={{
                position: "relative",
              }}
            >
              <button
                disabled={!showEdit ? true : disabled}
                className={!showEdit || disabled ? "month1-false" : "month1"}
                onClick={() => handleDay(day, currentMonth)}
                style={{
                  gridColumnStart: index === 0 ? getDayPosition : "auto",
                  backgroundColor:
                    dayIsSelected[currentMonth] &&
                    dayIsSelected[currentMonth][day] &&
                    toggle.add
                      ? "#2196f3"
                      : dayIsSelected[currentMonth] &&
                        dayIsSelected[currentMonth][day] &&
                        toggle.remove
                      ? "red"
                      : colorDay,
                  cursor: !showEdit
                    ? "not-allowed"
                    : disabled
                    ? "auto"
                    : "pointer",
                  color: disabled
                    ? "white"
                    : !showEdit
                    ? "darkblue"
                    : dayIsSelected[currentMonth] &&
                      dayIsSelected[currentMonth][day]
                    ? "white"
                    : "darkblue",
                }}
              >
                <span>{day}</span>
              </button>
              {toggle.remove &&
              colorDay !== "white" &&
              colorDay !== "#e6b226d0" &&
              !disabled ? (
                <DeleteOutlineIcon
                  color="error"
                  sx={{
                    position: "absolute",
                    bottom: "calc(0% + 2px)",
                    right: "calc(0% + 2px)",
                    bgcolor: "white",
                    borderRadius: "50px",
                  }}
                />
              ) : toggle.add &&
                (colorDay === "white" || colorDay === "#e6b226d0") ? (
                <AddIcon
                  color="info"
                  sx={{
                    position: "absolute",
                    bottom: "calc(0% + 2px)",
                    right: "calc(0% + 2px)",
                    bgcolor: "white",
                    borderRadius: "50px",
                  }}
                />
              ) : null}
            </div>
          );
        })}
        {daysCalendarCustom.month2.map((day, index) => {
          let dayName = obtainDayName(day, nextMonth, nextYear);
          let disabled = false;
          let colorDay = "white";
          if (
            days &&
            days[nextMonth] &&
            days[nextMonth][day] &&
            days[nextMonth][day].turn
          ) {
            colorDay = "#e6b226d0";
          }
          if (noWork[nextMonth] && noWork[nextMonth][day]) {
            colorDay = "gray";
          }
          if (
            !schedule[dayName] ||
            (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
          ) {
            disabled = true;
            colorDay = "gray";
          }
          if (
            (toggle.remove && colorDay !== "gray") ||
            (toggle.add && colorDay !== "#e6b226d0" && colorDay !== "white")
          ) {
            disabled = true;
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
                backgroundColor:
                  dayIsSelected[nextMonth] &&
                  dayIsSelected[nextMonth][day] &&
                  toggle.add
                    ? "#2196f3"
                    : dayIsSelected[nextMonth] &&
                      dayIsSelected[nextMonth][day] &&
                      toggle.remove
                    ? "red"
                    : colorDay,
                cursor: !showEdit
                  ? "not-allowed"
                  : disabled
                  ? "auto"
                  : "pointer",
                color: disabled
                  ? "white"
                  : !showEdit
                  ? "darkblue"
                  : dayIsSelected[nextMonth] && dayIsSelected[nextMonth][day]
                  ? "white"
                  : "darkblue",
              }}
            >
              <span>{day}</span>

              {toggle.remove &&
              colorDay !== "#e0e0e0d2" &&
              colorDay !== "#e6b226d0" &&
              !disabled ? (
                <>
                  {/* <hr /> */}
                  <DeleteOutlineIcon />
                </>
              ) : toggle.add &&
                (colorDay === "#e0e0e0d2" || colorDay === "#e6b226d0") ? (
                <AddIcon />
              ) : null}
            </button>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          marginTop: "10px",
          marginBottom: "15px",
        }}
      >
        <Box>
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
                backgroundColor: "white",
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
              Día laborable
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
              Día no laborable
            </h4>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
            <div
              style={{
                height: "18px",
                width: "18px",
                backgroundColor: "#2196f3",
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
              Para agregar
            </h4>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
            <div
              style={{
                height: "18px",
                width: "18px",
                backgroundColor: "red",
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
              Para sacar
            </h4>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CustomCalendarPlannedC;
