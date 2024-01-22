import React, { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import { Dialog, Grid, Slider, Box, Button, Backdrop } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import time from "../../helpers/arrayTime";
import HelpIcon from "@mui/icons-material/Help";
import formatHour from "../../functions/formatHour";
import durationMax from "../../helpers/durationMax";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});
const SliderModal = ({
  user,
  isOpen,
  setIsOpen,
  darkMode,
  setSubmit,
  openClose,
  timeSelected,
  setTimeSelected,
  handleSubmit,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [timeResult, setTimeResult] = useState([]); // aca estaran los values convertidos a time de back
  const handleClose = () => setIsOpen(false);

  const obtenerDuracionMaxima = (obj) => {
    let duracionMaxima = 0;
    for (const key in obj.services) {
      const servicio = obj.services[key];

      if (servicio && typeof servicio.duration === "number") {
        if (duracionMaxima === 0 || servicio.duration > duracionMaxima) {
          duracionMaxima = servicio.duration;
        }
      }
    }

    return duracionMaxima;
  };

  const maxDelay = obtenerDuracionMaxima(user);

  const [values, setValues] = useState([
    [660, 840],
    [660, 840],
  ]); // Solo 2 rangos

  useEffect(() => {
    setValues([
      [openClose[0], openClose[0] + maxDelay],
      [openClose[0], openClose[0] + maxDelay],
    ]);
  }, [openClose]);

  useEffect(() => {
    let array = new Array(1441).fill(null);
    let contador = 0;
    for (let i = array.length; i > 0; i--) {
      if ((contador = 0)) {
        contador++;
      }
      if (
        (i <= values[1][1] && i >= values[1][0]) ||
        (i <= values[0][1] && i >= values[0][0])
      ) {
        array[i] = "free";
        contador = 0;
      }
      if (contador > 0 && contador <= 30) {
        array[i] = "free";
      }
    }
    setTimeSelected(array);
  }, [values]);

  const marks = time;

  const handleChange = (event, newValue, index, stop) => {
    const newValues = [...values];
    newValues[index] = newValue;

    setValues(newValues);
  };

  return (
    <div>
      <Dialog
        sx={{
          height: "100vh",
        }}
        fullScreen={sm}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"md"}
        open={isOpen}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box /* container */
          sx={{
            height: sm ? "100vh" : "500px",
            backgroundColor: darkMode ? "#28292c" : "white",
            p: 3,
            display: "flex",
            flexDirection: sm ? "row" : "column",
            justifyContent: "space-between",
          }}
        >
          {!sm && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginBottom: "15px",
                borderBottom: "2px solid #2196f3",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <h2>Selección de horarios por rango</h2>
                <Button>
                  <HelpIcon />
                </Button>
              </Box>
            </Box>
          )}
          {/* ///// sección del Slider de materialUI /////  */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: sm ? "row" : "column",
              justifyContent: sm ? "center" : "",
              width: sm ? "40%" : "",
            }}
          >
            {values.map((value, index) => {
              return (
                <Slider
                  sx={{
                    height: sm ? "90vh" : "10px", // grosor del slider---------------------
                    width: sm ? "10px" : "95%",
                  }}
                  key={index}
                  value={value}
                  onChange={(event, newValue) =>
                    handleChange(event, newValue, index)
                  }
                  valueLabelDisplay="auto" // Configura para que se muestre solo cuando se selecciona
                  valueLabelFormat={(value) => formatHour(value)}
                  min={openClose[0]}
                  max={openClose[1]}
                  step={30}
                  orientation={sm ? "vertical" : "horizontal"}
                  marks={marks.map((mark) => {
                    if (index === 0 && mark.value % 60 === 0) {
                      // Solo renderiza los markLabels para el primer slider y si es divisible por 60
                      return {
                        ...mark,
                        label: (
                          <span
                            key={mark.value}
                            style={{
                              fontSize: "11px",
                              borderRadius: "5px",
                              padding: "3px",
                              color: values.some(
                                ([start, end]) =>
                                  mark.value >= start && mark.value <= end
                              )
                                ? "white"
                                : "",
                              /* writingMode: sm ? "horizontal" : "vertical-lr", */
                              backgroundColor: values.some(
                                ([start, end]) =>
                                  mark.value >= start && mark.value <= end
                              )
                                ? "#232bd16e"
                                : "",
                            }}
                          >
                            {formatHour(mark.label)}
                          </span>
                        ),
                      };
                    } else {
                      return {
                        ...mark,
                        label: null, // Si no es el primer slider o no es divisible por 60, no renderiza markLabels
                      };
                    }
                  })}
                />
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              width: sm ? "60%" : "100%",
              height: sm ? "100%" : "40%",
            }}
          >
            {sm /* render de una copia del titulo para reoganizar mobile */ && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginBottom: "15px",
                  borderBottom: "2px solid #2196f3",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <h2>Selecciona el horario</h2>
                  <Button>
                    <HelpIcon />
                  </Button>
                </Box>
              </Box>
            )}
            <Grid
              container
              gap={sm ? 5 : 0}
              sx={{
                height: sm ? "200px" : "",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  borderRadius: "5px",
                  border: "2px solid #2196f3",
                  padding: "10px",
                }}
              >
                <Box>
                  <h2>{formatHour(values[0][0])} hs</h2>
                </Box>
                <h2>a</h2>

                <Box>
                  <h2>{formatHour(values[0][1])} hs</h2>
                </Box>
              </Grid>
              {/*---------------------  mostrar condicionalmente el segundo grid si hay 2 valores para mostrar -----------*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  borderRadius: "5px",
                  border: "2px solid #2196f3",
                  padding: "10px",
                }}
              >
                <Box>
                  <h2>{formatHour(values[1][0])} hs</h2>
                </Box>
                <h2>a</h2>
                <Box>
                  <h2>{formatHour(values[1][1])} hs</h2>
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: sm ? "column" : "row-reverse",
                width: sm ? "80%" : "100%",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                  marginBottom: sm ? "25px" : "",
                }}
                onClick={() => {
                  handleSubmit(timeSelected, values), handleClose();
                }}
              >
                Confirmar
              </Button>
              <Button
                variant="outlined"
                sx={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                  marginBottom: sm ? "25px" : "",
                }}
                onClick={() => {
                  handleClose();
                  setValues([
                    [420, 480],
                    [1380, 1440],
                  ]);
                }}
              >
                Volver
              </Button>
            </Box>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default SliderModal;
