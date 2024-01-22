import { useState } from "react";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import "./customCalendar.css";
import { Box } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

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
  const getDayPosition = getToday();
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

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
      <Box className={"line7day-query600px"}>
        {daysOfWeek.map((day) => (
          <h4 key={day}>{day}</h4>
        ))}
      </Box>

      <Box className={"line7-query600px"}>
        {Object.keys(days).length > 0 &&
          daysCalendarCustom.month1.map((day, index) => {
            let dayName = obtainDayName(day, currentMonth, currentYear);
            let disabled = false;
            let colorDay = "#e0e0e0d2";
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
          return (
            <button
              key={index + 100}
              disabled={!showEdit ? true : disabled}
              className={!showEdit || disabled ? "month2-false" : "month2"}
              onClick={() => handleDay(day, nextMonth)}
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
              height: "14px",
              width: "14px",
              backgroundColor: "#e6b226d0",
              borderRadius: "25px",
            }}
          ></div>
          <h4>Con reserva/s</h4>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
          <div
            style={{
              height: "14px",
              width: "14px",
              backgroundColor: "gray",
              borderRadius: "25px",
            }}
          ></div>
          <h4>No laborable</h4>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", margin: "5px" }}>
          <div
            style={{
              height: "14px",
              width: "14px",
              backgroundColor: "#e0e0e0d2",
              borderRadius: "25px",
            }}
          ></div>
          <h4>Día hábil</h4>
        </Box>
      </Box>
    </div>
  );
};

export default CustomCalendarPlannedC;



