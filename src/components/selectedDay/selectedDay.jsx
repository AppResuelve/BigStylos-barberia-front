import { useEffect, useState } from "react";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import { Box, Grid } from "@mui/material";
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
          xs={12}
          sm={12}
          md={12}
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
           /*  alignItems: "center", */
          }}
        >
          <Box sx={{
            display: "flex",
          }}>
            <h2 style={{marginRight: "10px"}}>{item}</h2> 
            <h2>hola</h2>
 
          </Box>
          <hr style={{ width: "100%", marginBottom: "10px" }} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SelectedDay;
