import React, { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import Slide from "@mui/material/Slide";
import { Dialog, Slider, Box, Button, Backdrop } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import time from "../../helpers/arrayTime";
import HelpIcon from "@mui/icons-material/Help";
import formatHour from "../../functions/formatHour";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});

const SliderModal = ({
  userData,
  isOpen,
  setIsOpen,
  openClose,
  timeSelected,
  setTimeSelected,
  handleSubmit,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [timeResult, setTimeResult] = useState([]); // aca estaran los values convertidos a time de back
  const [values, setValues] = useState([
    [660, 840],
    [660, 840],
  ]); // Solo 2 rangos
  const [isChecked, setIsChecked] = useState(false);
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
  const maxDelay = obtenerDuracionMaxima(userData);

  useEffect(() => {
    setValues([
      [openClose[0], openClose[0] + maxDelay],
      [openClose[0], openClose[0] + maxDelay],
    ]);
  }, [openClose]);

  useEffect(() => {
    let array = new Array(1440).fill(null).map(() => ({
      applicant: null,
      requiredService: null,
      ini: null,
      end: null,
    }));
    for (let i = 0; array.length > i; i++) {
      if (
        (i <= values[1][1] && i >= values[1][0]) || // values 30 , 0
        (i <= values[0][1] && i >= values[0][0]) // values 30 , 0
      ) {
        array[i].applicant = "free";
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

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  return (
    <div>
      <Dialog
        fullScreen={sm}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"md"}
        open={isOpen}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Box
          sx={{
            height: sm ? "100vh" : "fit-content",
            width: "100%",
            backgroundColor: "var(--bg-color)",
            p: 2,
            display: "flex",
            flexDirection: sm ? "row" : "column",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          {!sm && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                paddingBottom: "10px",
                borderBottom: "2px solid var(--bg-color-secondary)",
                gap: "10px",
              }}
            >
              <h2 style={{ color: "var(--text-color)" }}>
                Selección de horarios por rango
              </h2>
              <HelpIcon />
            </div>
          )}
          {/* ///// sección del Slider de materialUI /////  */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: sm ? "row" : "column",
              justifyContent: sm ? "center" : "space-between",
              width: sm ? "40%" : "",
              backgroundColor: "var(--bg-color-secondary)",
              borderRadius: "10px",
              height: sm ? "100%" : "120px",
              padding: "10px",
            }}
          >
            {values.map((value, index) => {
              return (
                <Slider
                  sx={{
                    height: sm ? "96%" : "15px", // grosor del slider---------------------
                    width: sm ? "10px" : "95%",
                  }}
                  disabled={index === 1 && !isChecked}
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
                  componentsProps={{
                    valueLabel: {
                      sx: {
                        width: "55px",
                        backgroundColor: "var(--accent-color)", // Cambia el fondo del label
                        fontSize: "18px",
                        fontWeight: "bold", // Cambia el tamaño de la fuente
                        borderRadius: "5px", // Ajusta el borde del label
                        padding: "4px", // Ajusta el padding
                        "& span": {
                          color: "white", // Cambia el color del texto del valueLabel
                        },
                      },
                    },
                    rail: {
                      sx: {
                        backgroundColor: "var(--bg-color)",
                      },
                    },
                    track: {
                      sx: {
                        zIndex: "1",
                        width: sm && index === 1 && !isChecked ? "6px" : "12px",
                        height:
                          !sm && index === 1 && !isChecked ? "8px" : "13px",
                        backgroundColor:
                          index === 1 && !isChecked
                            ? "var(--accent-color-disabled)"
                            : "var(--accent-color)",
                        border:
                          index === 1 && !isChecked
                            ? "none"
                            : "2px solid var(--accent-color)", // Cambia el color del texto
                      },
                    },
                    mark: {
                      sx: {
                        borderRadius: "10px",
                        backgroundColor: "var(--bg-color)",
                        width: "4px",
                        height: "4px",
                      },
                    },
                    // perillas (thumb)
                    thumb: {
                      sx: {
                        zIndex: "2",
                        width: index === 1 && !isChecked ? "18px" : "22px", // Ajusta el tamaño de la perilla
                        height: index === 1 && !isChecked ? "18px" : "22px", // Ajusta el tamaño de la perilla
                        backgroundColor: "white", // Color de fondo de la perilla
                        border:
                          index === 1 && !isChecked
                            ? "none"
                            : "2px solid var(--accent-color-hover)", // Borde de la perilla
                        "&:hover": {
                          boxShadow: "0 0 0 8px rgba(0, 0, 0, 0.16)", // Efecto hover (sombra)
                        },
                        "&.Mui-active": {
                          boxShadow: "0 0 0 14px rgba(0, 0, 0, 0.16)", // Sombra cuando está activa
                        },
                      },
                    },
                  }}
                  marks={marks.map((mark) => {
                    if (index === 0 && mark.value % 60 === 0) {
                      // Solo renderiza los markLabels para el primer slider y si es divisible por 60
                      return {
                        ...mark,
                        label: (
                          <div
                            key={mark.value}
                            style={{
                              fontSize: "12px",
                              borderRadius: "15px",
                              padding: "4px",
                              margin: sm ? "4px" : "7px",
                              color: values.some(
                                ([start, end]) =>
                                  mark.value >= start && mark.value <= end
                              )
                                ? "var(--bg-color)"
                                : "var(--text-color)",
                              backgroundColor: values.some(
                                ([start, end]) =>
                                  mark.value >= start && mark.value <= end
                              )
                                ? "var(--text-color)"
                                : "var(--bg-color)",
                            }}
                          >
                            {formatHour(mark.label)}
                          </div>
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
              justifyContent: "space-between",
              width: sm ? "100%" : "100%",
              height: "100%",
              // paddingRight: sm ? "10px" : "0px",
            }}
          >
            {sm && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingBottom: "10px",
                  borderBottom: "2px solid var(--bg-color-secondary)",
                  gap: "10px",
                }}
              >
                <h2 style={{ color: "var(--text-color)" }}>
                  Selección de horarios
                </h2>
                <HelpIcon />
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: sm ? "column" : "row",
                justifyContent: sm ? "" : "space-between",
                width: "100%",
                gap: "15px",
              }}
            >
              <div
                style={{
                  width: sm ? "100%" : "50%",
                  height: "110px",
                  backgroundColor: "var(--bg-color-secondary)",
                  padding: "10px",
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: "70px" }}>
                  <span>Turno 1 (Habilitado)</span>
                  {/* <div className="container-switch">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={darkMode.on ? true : false}
                    />
                    <label className="switch">
                      <span className="slider"></span>
                    </label>
                  </div> */}
                </div>
                <hr
                  style={{
                    marginTop: "5px",
                    width: "100%",
                    border: "1px solid var(--bg-color-medium)",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "5px",
                    padding: "10px",
                    color: "var(--text-color)",
                    fontSize: "13px",
                  }}
                >
                  <h2>{formatHour(values[0][0])}hs</h2>
                  <h2>a</h2>
                  <h2>{formatHour(values[0][1])}hs</h2>
                </div>
              </div>
              <div
                style={{
                  width: sm ? "100%" : "50%",
                  height: "110px",
                  backgroundColor: "var(--bg-color-secondary)",
                  padding: "10px",
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: "70px",
                  }}
                >
                  <span style={{ width: sm ? "80px" : "fit-content" }}>
                    Turno 2 {isChecked ? "(Habilitado)" : "(Deshabilitado)"}
                  </span>
                  <div
                    className="container-switch"
                    onClick={handleCheckboxChange}
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label className="switch">
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <hr
                  style={{
                    marginTop: "5px",
                    width: "100%",
                    border: "1px solid var(--bg-color-medium)",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "5px",
                    padding: "10px",
                    color: "var(--text-color)",
                    fontSize: "13px",
                  }}
                >
                  <h2>{formatHour(values[1][0])}hs</h2>
                  <h2>a</h2>
                  <h2>{formatHour(values[1][1])}hs</h2>
                </div>
              </div>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: sm ? "column" : "row-reverse",
                width: "100%",
                justifyContent: sm ? "" : "space-between",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                  marginBottom: sm ? "15px" : "",
                }}
                onClick={() => {
                  handleSubmit(timeSelected, values), handleClose();
                }}
              >
                Confirmar Día
              </Button>
              <Button
                variant="outlined"
                style={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  handleClose();
                  setValues([
                    [420, 480],
                    [1380, 1440],
                  ]);
                }}
              >
                Descartar
              </Button>
            </Box>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default SliderModal;
