import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import timeForRenderedStructure from "../../functions/timeForRenderedStructure";

const SelectedDay = ({
  firstMonth,
  firstDay,
  days,
  dayIsSelected,
  setDayIsSelected,
  schedule,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [renderedStructure, setRenderedStructure] = useState([]);

  useEffect(() => {
    if (dayIsSelected && Object.keys(dayIsSelected).length > 0) {
      const recorrerEstructura = (obj, ruta = "") => {
        const result = [];
        for (const prop in obj) {
          const nuevaRuta = ruta ? `${prop}/${ruta}` : prop;

          if (
            typeof obj[prop] === "object" &&
            Object.keys(obj[prop]).length > 0
          ) {
            result.push(...recorrerEstructura(obj[prop], nuevaRuta));
          } else {
            result.push(nuevaRuta);
          }
        }
        return result;
      };

      const result = recorrerEstructura(dayIsSelected);
      setRenderedStructure(result);
    } else {
      setRenderedStructure([]);
    }
  }, [dayIsSelected]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "350px",
      }}
    >
      <h2
        style={{
          width: "100%",
          marginBottom: "12px",
          color: darkMode.on ? "white" : darkMode.dark,
        }}
      >
        Días seleccionados :
        {renderedStructure.length > 0 ? renderedStructure.length : 0}
      </h2>
      {/* Renderizamos cada elemento del resultado */}
      <div style={{ overflow: "scroll" }}>
        {renderedStructure.map((item, index) => (
          <div
            key={index}
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
            }}
          >
            <div
              sx={{
                display: "flex",
              }}
            >
              <h2
                style={{
                  marginRight: "10px",
                  color: darkMode.on ? "white" : darkMode.dark,
                }}
              >
                {item}
              </h2>
              {days && days[firstMonth] && days[firstMonth][firstDay] ? (
                <h4 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                  {timeForRenderedStructure(days[firstMonth][firstDay].time)}
                </h4>
              ) : null}
            </div>
            <hr
              style={{
                width: "100%",
                marginBottom: "10px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDay;
