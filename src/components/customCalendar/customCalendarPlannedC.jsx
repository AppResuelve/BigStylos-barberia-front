import { useState } from "react";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import "./customCalendar.css";
import { Box, createTheme, useMediaQuery } from "@mui/material";

const CustomCalendarPlannedC = ({
  schedule,
  amountOfDays,
  dayIsSelected,
  setDayIsSelected,
  showEdit,
  days,
  setDaysWithTurns,
}) => {
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, false);
  let { currentMonth, nextMonth, currentYear, nextYear } = daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday() + 1;
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 2000,
      },
    },
  });
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDay = (day, month, hasTurn) => {
//     if (hasTurn) {
//       console.log("setee en true el turns");
//       setDaysWithTurns(true);
//     }

    setDayIsSelected((prevState) => {
      const newState = { ...prevState };

      if (newState[month] && newState[month][day]) {
        // Si ya existe en dayIsSelected, lo quitamos
       
        const { [day]: _, ...rest } = newState[month];

        if (Object.keys(rest).length < 1) {
          delete newState[month];
        } else {
          newState[month] = rest;
        }
      } else {
        // Si no existe, lo agregamos
        newState[month] = {
          ...newState[month],
          [day]: {},
        };
      }

      return newState;
    });
      };
      
  return (
    <div className="div-container-calendar">
      <Box className={!sm ? "line7day-query600px" : "line7day"}>
        {daysOfWeek.map((day) => (
          <h4 key={day}>{day}</h4>
        ))}
      </Box>

      <Box className={!sm ? "line7-query600px" : "line7"}>
        {Object.keys(days).length > 0 &&
          daysCalendarCustom.month1.map((day, index) => {
            let dayName = obtainDayName(day, currentMonth, currentYear);
            let disabled = false;
            let colorDay = "green";
            let hasTurn = false;

            if (
              days &&
              days[currentMonth] &&
              days[currentMonth][day] &&
              days[currentMonth][day].turn
            ) {
              hasTurn = true;
              colorDay = "lightgreen";
            } else {
              hasTurn = false;
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
                key={index}
                disabled={!showEdit ? true : disabled}
                className={showEdit ? "month1" : "month1-false"}
                onClick={() => handleDay(day, currentMonth, hasTurn)}
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
                }}
              >
                {day}
              </button>
            );
          })}
        {daysCalendarCustom.month2.map((day, index) => {
          let dayName = obtainDayName(day, nextMonth, nextYear);
          let disabled = false;
          let colorDay = "green";
          let hasTurn;
          if (
            days &&
            days[nextMonth] &&
            days[nextMonth][day] &&
            days[nextMonth][day].turn
          ) {
            hasTurn = true;
            colorDay = "lightgreen";
          } else {
            hasTurn = false;
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
              className={showEdit ? "month2" : "month2-false"}
              disabled={!showEdit ? true : disabled}
              onClick={() => handleDay(day, nextMonth, hasTurn)}
              style={{
                backgroundColor: colorDay,
                ...(dayIsSelected[nextMonth] && dayIsSelected[nextMonth][day]
                  ? { backgroundColor: "gray" }
                  : {}),
                cursor: !showEdit
                  ? "not-allowed"
                  : disabled
                  ? "auto"
                  : "pointer",
              }}
            >
              {day}
            </button>
          );
        })}
      </Box>
      <Box>
        <div
          style={{
            height: "14px",
            width: "14px",
            backgroundColor: "gray",
            borderRadius: "25px",
          }}
        ></div>
        <h4>No laborable</h4>
        <div
          style={{
            height: "14px",
            width: "14px",
            backgroundColor: "lightgreen",
            borderRadius: "25px",
          }}
        ></div>
        <h4>Día con reserva/s</h4>
        <div
          style={{
            height: "14px",
            width: "14px",
            backgroundColor: "red",
            borderRadius: "25px",
          }}
        ></div>
        <h4>Día seleccionado</h4>
        <div
          style={{
            height: "14px",
            width: "14px",
            backgroundColor: "blue",
            borderRadius: "25px",
          }}
        ></div>
        <h4>Día eliminado</h4>
      </Box>
    </div>
  );
};

export default CustomCalendarPlannedC;
