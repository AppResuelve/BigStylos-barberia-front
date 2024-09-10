import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import timeForRenderedStructure from "../../functions/timeForRenderedStructure";
import { Button } from "@mui/material";

const SelectedDay = ({
  selectAllDays,
  deselectAllDays,
  firstMonth,
  firstDay,
  days,
  dayIsSelected,
  md,
  sm,
}) => {
  const { darkMode } = useContext(ThemeContext);
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
        maxHeight: md ? "250px" : "350px",
        margin: md ? "0px 0px 20px 0px" : "50px 0px 20px 0px",
      }}
    >
      <div style={{ width: "100%" }}>
        <Button
          variant="outlined"
          sx={{
            width: "calc(50% - 5px)",
            marginRight: "5px",
            fontSize: sm ? "12px" : "14px",
            height: "35px",
            fontFamily: "Jost, sans serif",
          }}
          onClick={() => selectAllDays()}
        >
          Seleccionar todo
        </Button>
        <Button
          variant="outlined"
          sx={{
            width: "calc(50% - 5px)",
            marginLeft: "5px",
            fontSize: sm ? "12px" : "14px",
            lineHeight: "1",
            height: "35px",
            fontFamily: "Jost, sans serif",
          }}
          onClick={() => deselectAllDays()}
        >
          Deseleccionar todo
        </Button>
      </div>
      <h2
        style={{
          width: "100%",
          margin: "10px 0px 12px 0px",
          color: darkMode.on ? "white" : darkMode.dark,
        }}
      >
        Días seleccionados :
        {renderedStructure.length > 0 ? renderedStructure.length : 0}
      </h2>
      {/* Renderizamos cada elemento del resultado */}
      <div
        style={{
          overflow: "scroll",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {renderedStructure.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flex: "0 0 48%",
              padding: "5px",
              margin: "1%",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #2196f3",
              borderRadius: "10px",
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
        ))}
      </div>
    </div>
  );
};

export default SelectedDay;
