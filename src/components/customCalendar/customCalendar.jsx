import { useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box } from "@mui/material";
import "./customCalendar.css";

const CustomCalendar = ({
  setDayIsSelected,
  amountOfDays,
  dayIsSelected,
  days,
  showEdit,
  schedule,
  loading,
  noWork,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, false);
  let { currentMonth, nextMonth, currentYear, nextYear, month1, month2 } =
    daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday() + 1;
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [exist50, setExist50] = useState(false);

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
      <Box className={"line7day"}>
        {daysOfWeek.map((day) => (
          <h4
            key={day}
            style={{ color: darkMode.on ? "white" : darkMode.dark }}
          >
            {day}
          </h4>
        ))}
      </Box>

      <Box className={"line7-calendar"}>
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
              className="month1"
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
              className="month2"
              disabled={!showEdit ? true : disabled}
              onClick={() => handleDay(day, nextMonth)}
              style={{
                gridColumnStart:
                  month1.length < 1 && index === 0 ? getDayPosition : "auto",
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
          <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
            <div
              style={{
                height: "18px",
                width: "18px",
                backgroundColor: "#5bfd33d0",
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
              Día de trabajo
            </h4>
          </Box>
        </Box>
        <Box>
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
              Día seleccionado
            </h4>
          </Box>
        </Box>
      </Box>
      {md && (
        <hr
          style={{
            width: "100%",
            border: "2px solid lightgray",
            borderRadius: "10px",
          }}
        />
      )}
    </div>
  );
};

export default CustomCalendar;
