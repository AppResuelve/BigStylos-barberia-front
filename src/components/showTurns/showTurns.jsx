import axios from "axios";
import React, { useEffect, useState } from "react";
import formatHour from "../../functions/formatHour";
import Slide from "@mui/material/Slide";
import { Dialog, Grid, Slider, Box, Button, Backdrop } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import NoUser from "../../assets/icons/noUser.png";
import "./showTurns.css";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});

const ShowTurns = ({
  dayIsSelected,
  serviceSelected,
  user,
  isOpen,
  setIsOpen,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const handleClose = () => setIsOpen(false);
  const [dayForTurns, setDayForTurns] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  useEffect(() => {
    const fetchday = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/dayforturns`,
          { dayForTurns: dayIsSelected }
        );
        const { data } = response;
        setDayForTurns(data);
      } catch (error) {
        console.error("Error al obtener el día:", error);
      }
    };
    fetchday();
  }, [dayIsSelected]);

  useEffect(() => {
    var renderizate = [];
    if (dayForTurns.length > 0) {
      for (let i = 0; i < dayForTurns.length; i++) {
        renderizate.push([dayForTurns[i].email]);
        let contador = null;
        let init = 0;
        for (let k = 0; k < dayForTurns[i].time.length; k++) {
          if (dayForTurns[i].time[k] == "free") {
            contador++;
          }
          if (contador == 1) {
            init = k;
          }
          if (contador == dayForTurns[i].services[serviceSelected].duration) {
            renderizate[i].push(init);
            contador = null;
          }
        }
      }
      setButtons(renderizate);
    }
  }, [dayForTurns]);

  const handleSelectTime = (workerEmail, selectTime) => {
    const tardanza = dayForTurns.filter(
      (element) => element.email == workerEmail
    );
    console.log(
      `la duracion del servicio es: ${tardanza[0].services[serviceSelected].duration}`
    );
    console.log(workerEmail, selectTime, serviceSelected);
    setSelectedTime(selectTime);
    setSelectedWorker(workerEmail);
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
            height: sm ? "100vh" : "100%",
            // backgroundColor: darkMode ? "#28292c" : "white",
            p: 3,
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
          }}
        >
          <Box>
            <Button
              sx={{
                fontFamily: "Jost, sans serif",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              <ArrowBackIosNewIcon />
              Volver a calendario
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <h2
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginRight: "4px",
                }}
              >
                Horarios disponibles para el:
              </h2>
              <h2 style={{ display: "flex", justifyContent: "center" }}>
                {`${dayIsSelected[0]}/${dayIsSelected[1]}`}
              </h2>
            </Box>
            <hr style={{ marginBottom: "2px" }} />
          </Box>
          <Box sx={{ maxHeight: !sm ? "40vh" : "60%", overflow: "scroll" }}>
            {buttons.map((buttonGroup, index) => (
              <Box
                key={index}
                sx={{
                  height: "120px",
                  border: "2px solid #2196f3",
                  borderRadius: "5px",
                  padding: "4px",
                  marginTop: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {buttonGroup.map((button, buttonIndex) => {
                  if (buttonIndex === 0) {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <h2 key={button}>{button}</h2>;
                        <img
                          src={NoUser}
                          alt="Profesional"
                          style={{ width: "40px" }}
                        />
                      </Box>
                    );
                  }
                })}
                <Box className="box-to-scroll">
                  {buttonGroup.map((button, buttonIndex) => {
                    if (buttonIndex === 0) {
                      return null;
                    } else {
                      return (
                        <Button
                          sx={{
                            height: "40px",
                            width: "75px",
                            margin: "3px",
                            fontFamily: "Jost, sans serif",
                            fontWeight: "bold",
                            letterSpacing: "2px",
                          }}
                          key={buttonIndex}
                          variant="contained"
                          onClick={() =>
                            handleSelectTime(buttonGroup[0], button)
                          }
                        >
                          {formatHour(button)}
                        </Button>
                      );
                    }
                  })}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ height: "30%" }}>
            <Box>
              <h2>Resumen del turno:</h2>
              <hr />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                sx={{ display: "flex", width: "100%", alignItems: "center" }}
              >
                <h2>{serviceSelected}</h2>
                <h3>para el</h3>
                <h2>
                  {dayIsSelected[0]}/{dayIsSelected[1]}
                </h2>
                <h3>a las</h3>
                <h2>{formatHour(selectedTime)}</h2>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                }}
              >
                <Box>
                  <h2>Profesional:</h2>
                  <h2>{selectedWorker}</h2>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    maxHeight: "35px",
                    fontFamily: "Jost, sans serif",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                  }}
                >
                  {sm ? "Confirmar" : "Confimar turno"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ShowTurns;
