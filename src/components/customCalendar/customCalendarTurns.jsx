import { useEffect, useState, useContext } from "react";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import getToday from "../../functions/getToday";
import obtainDayName from "../../functions/obtainDayName";
import axios from "axios";
import ThemeContext from "../../context/ThemeContext";
import "./customCalendar.css";
import { Skeleton } from "@mui/material";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomCalendarTurns = ({
  days,
  dayIsSelected,
  setDayIsSelected,
  serviceSelected,
  selectedWorker,
  setTurnsButtons,
  isCalendarLoading,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const daysCalendarCustom = daysMonthCalendarCustom(27, true);
  const { currentMonth, nextMonth, currentYear, nextYear, month1 } =
    daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday() == 0 ? 7 : getToday();
  const [schedule, setSchedule] = useState({});
  const [noWork, setNoWork] = useState({});
console.log(isCalendarLoading);

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
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/workdays/dayforturns`,
        {
          dayForTurns: [day, month],
          worker: selectedWorker.email,
          service: serviceSelected.name,
        }
      );
      const { data } = response;
      window.scrollTo({ top: 0, behavior: "instant" });
      setTurnsButtons(data);
      setDayIsSelected([day, month]);
    } catch (error) {
      console.error("Error al obtener los horarios", error);
      alert("Error al obtener los horarios");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        backgroundColor: "var(--bg-color-secondary)",
        borderRadius: "20px",
        padding: "6px",
      }}
    >
      <div className="div-container-calendar">
        <div className="line7day">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        {isCalendarLoading ? (
          <div className="line7-calendar">
            {daysCalendarCustom.month1.map((day, index) => {
              return (
                <div
                  key={index}
                  className="month1"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gridColumnStart: index === 0 ? getDayPosition : "auto",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "15px",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    sx={{
                      bgcolor: "var(--bg-color)",
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                      "@keyframes wave": {
                        "0%": {
                          transform: "translateX(-100%)",
                        },
                        "100%": {
                          transform: "translateX(100%)",
                        },
                      },
                      animationDuration: "1s",
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      borderRadius: "15px",
                    }}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
            {daysCalendarCustom.month2.map((day, index) => {
              return (
                <div
                  key={index + 100}
                  className="month2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gridColumnStart:
                      month1.length < 1 && index === 0
                        ? getDayPosition
                        : "auto",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "15px",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    sx={{
                      bgcolor: "var(--bg-color)",
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                      "@keyframes wave": {
                        "0%": {
                          transform: "translateX(-100%)",
                        },
                        "100%": {
                          transform: "translateX(100%)",
                        },
                      },
                      animationDuration: "1s",
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      borderRadius: "15px",
                    }}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          Object.keys(days).length > 0 && (
            <div className="line7-calendar">
              {daysCalendarCustom.month1.map((day, index) => {
                let dayName = obtainDayName(day, currentMonth, currentYear);
                let colorDay = "var(--bg-color)";
                let disable = true;
                if (days[currentMonth] && days[currentMonth][day]) {
                  disable = false;
                  colorDay = "var(--color-disponibility)";
                }
                if (noWork[currentMonth] && noWork[currentMonth][day]) {
                  disable = true;
                  colorDay = "var(--bg-color-medium)";
                }
                if (
                  !schedule[dayName] ||
                  (schedule[dayName].open === 0 &&
                    schedule[dayName].close === 1440)
                ) {
                  disable = true;
                  colorDay = "var(--bg-color-medium)";
                }

                return (
                  <button
                    key={index}
                    className="month1"
                    onClick={() => getTime(day, currentMonth)}
                    disabled={disable}
                    style={{
                      gridColumnStart: index === 0 ? getDayPosition : "auto",
                      backgroundColor:
                        dayIsSelected.length > 0 &&
                        dayIsSelected[0] == day &&
                        dayIsSelected[1] == currentMonth
                          ? "var(--accent-color)"
                          : colorDay,
                      color: disable ? "#9f9f9f" : "white",
                      fontSize:
                        days[currentMonth] && days[currentMonth][day]
                          ? "22px"
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
                let colorDay = "var(--bg-color)";
                let disable = true;
                if (days[nextMonth] && days[nextMonth][day]) {
                  disable = false;
                  colorDay = "var(--color-disponibility)";
                }
                if (noWork[nextMonth] && noWork[nextMonth][day]) {
                  disable = true;
                  colorDay = "var(--bg-color-medium)";
                }
                if (
                  !schedule[dayName] ||
                  (schedule[dayName].open === 0 &&
                    schedule[dayName].close === 1440)
                ) {
                  disable = true;
                  colorDay = "var(--bg-color-medium)";
                }

                return (
                  <button
                    key={index + 100}
                    className="month2"
                    onClick={() => getTime(day, nextMonth)}
                    disabled={disable}
                    style={{
                      gridColumnStart:
                        month1.length < 1 && index === 0
                          ? getDayPosition
                          : "auto",
                      backgroundColor:
                        dayIsSelected.length > 0 &&
                        dayIsSelected[0] == day &&
                        dayIsSelected[1] == nextMonth
                          ? "var(--accent-color)"
                          : colorDay,
                      color: disable ? "white" : "white",
                      fontSize:
                        days[nextMonth] && days[nextMonth][day] ? "22px" : "",
                      cursor: disable ? "" : "pointer",
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CustomCalendarTurns;
