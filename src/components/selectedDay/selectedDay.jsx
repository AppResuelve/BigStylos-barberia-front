import { useEffect, useState } from "react";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import { Grid } from "@mui/material";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SelectedDay = ({
  firstMonth,
  firstDay,
  days,
  dayIsSelected,
  setDayIsSelected,
  schedule,
}) => {
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
    }
  }, [dayIsSelected]);


  return (
    <Grid
      container
      style={{
        display: "flex",
        // paddingLeft: "0px",
      }}
    >
      <h2 style={{ width: "100%", marginBottom: "12px" }}>
        Días seleccionados :
        {renderedStructure.length > 0 ? renderedStructure.length : 0}
      </h2>
      {/* Renderizamos cada elemento del resultado */}
      {renderedStructure.map((item, index) => (
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid item key={index}>
            <h2>{item}</h2>
          </Grid>
          <hr style={{ width: "100%", marginBottom: "10px" }} />
        </Grid>
      ))}
      {/* {days && days[firstMonth] && days[firstMonth][firstDay] ? (
        <button onClick={handleEdit}>editar horarios</button>
      ) : (
        <button onClick={handleEdit}>asignar horarios</button>
      )} */}
    </Grid>
  );
};

export default SelectedDay;
