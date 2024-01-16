import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { Dialog, Grid, Slider } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import time from "../../helpers/arrayTime";
import HelpIcon from "@mui/icons-material/Help";
import formatHour from "../../functions/formatHour";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});
const SliderModal = ({ isOpen, setIsOpen, darkMode, setSubmit, timeSelected, setTimeSelected }) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  const [timeResult, setTimeResult] = useState([])   // aca estaran los values convertidos a time de back

  const handleClose = () => setIsOpen(false);

  const [values, setValues] = useState([
    [420, 480],
    [1380, 1440],
  ]); // Solo 2 rangos

  useEffect(() => {
    let array = new Array(1441).fill(null);
    let contador = 0
    for (let i = array.length; i > 0; i--) {
      if (contador = 0) {
        contador ++
      }
      if(i <= values[1][1] && i >=values[1][0] || i <= values[0][1] && i >= values[0][0]){
        array[i] = 'free'
        contador = 0
      }
      if(contador > 0 && contador <= 30) {
        array[i] = 'free'
      }
    }
      setTimeSelected(array)

  },[values])

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
          height: sm ? "100vh" : "600px",
         /*  top: "70px", */
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
        <Box
          sx={{
            height: "500px",
            backgroundColor: darkMode ? "#28292c" : "white",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
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
              <Button /* onClick={} */>
                <HelpIcon />
              </Button>
            </Box>
          </Box>
          {/* ///// sección del Slider de materialUI /////  */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: sm ? "row" : "column",
              marginBottom: "45px",
            }}
          >
            {values.map((value, index) => {
              return (
                <Slider
                  sx={{
                    height: sm ? "80vh" : "10px",  // grosor del slider---------------------
                    width: sm ? "10px" : "95%",
                  }}
                  key={index}
                  value={value}
                  onChange={(event, newValue) => handleChange(event, newValue, index)}
                  valueLabelDisplay="auto" // Configura para que se muestre solo cuando se selecciona
                  valueLabelFormat={(value) => formatHour(value)}
                  min={420}
                  max={1440}
                  step={30}
                  orientation={sm ? "vertical" : "horizontal"}
                  marks={marks.map((mark) => {
        if (index === 0 && mark.value % 60 === 0) { // Solo renderiza los markLabels para el primer slider y si es divisible por 60
          return {
            ...mark,
            label: (
              <span
                key={mark.value}
                style={{
                  fontSize: "11px",
                  borderRadius: "5px",
                  padding: "3px",
                  color: values.some(([start, end]) => mark.value >= start && mark.value <= end) ? "white" : "",
                  /* writingMode: sm ? "horizontal" : "vertical-lr", */
                  backgroundColor: values.some(([start, end]) => mark.value >= start && mark.value <= end) ? "#232bd16e" : "",
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
            <Grid
              container
              sx={{
                marginTop: "35px",
                borderRadius: "5px",
              }}
            >
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  borderRadius: "5px 0px 0px 5px",
                  border: "2px solid #2196f3",
                  padding: "10px",
                }}
              >
                <h3>de</h3>

                <Box>
                  <h2>{formatHour(values[0][0])}hs</h2>
                </Box>
                <h3>a</h3>

                <Box>
                  <h2>{formatHour(values[0][1])}hs</h2>
                </Box>
              </Grid>
{/*---------------------  mostrar condicionalmente el segundo grid si hay 2 valores para mostrar -----------*/}
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  borderRadius: "0px 5px 5px 0px",
                  border: "2px solid #2196f3",
                  padding: "10px",
                }}
              >
                <h3>de</h3>

                <Box>
                  <h2>{formatHour(values[1][0])}hs</h2>
                </Box>
                <h3>a</h3>
                <Box>
                  <h2>{formatHour(values[1][1])}hs</h2>
                </Box>
              </Grid>
            </Grid>
          </div>
          <Box
            sx={{
              display: "flex",
              alignSelf: "end",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              sx={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
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
            <Button
              variant="contained"
              sx={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
              onClick={() => {
                setSubmit(true), handleClose();
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default SliderModal;
