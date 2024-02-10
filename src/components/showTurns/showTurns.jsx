import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import formatHour from "../../functions/formatHour";
import Slide from "@mui/material/Slide";
import { Dialog, Box, Button, Backdrop, Skeleton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import NoUser from "../../assets/icons/noUser.png";
import ShowTimeCarousel from "../interfazMUI/showTimeCarousel";
import axios from "axios";
import "./showTurns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});

const ShowTurns = ({
  dayIsSelected,
  setDayIsSelected,
  serviceSelected,
  user,
  isOpen,
  setIsOpen,
  detailTurn,
  setDetailTurn,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const handleClose = () => {
    setDayIsSelected({});
    setIsOpen(false);
  };
  const [dayForTurns, setDayForTurns] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedWorkerName, setSelectedWorkerName] = useState("");

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
        renderizate[i].push(dayForTurns[i].name);
        renderizate[i].push(dayForTurns[i].image);

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

  const handleSelectTime = (workerEmail, workerName) => {
    const tardanza = dayForTurns.filter(
      (element) => element.email == workerEmail
    );

    setSelectedWorker(workerEmail);
    setSelectedWorkerName(workerName);
  };

  const handleAsignTurn = () => {
    let tardanza = dayForTurns.filter(
      (element) => element.email == selectedWorker
    );
    setDetailTurn({
      workerEmail: selectedWorker, // email del worker
      userEmail: user.email, // email del usuario
      selectedTime: selectedTime, // minutos del turno, los index de los botones de horarios
      tardanza: tardanza[0].services[serviceSelected].duration, // cuanto tarda el servicio
      serviceSelected: serviceSelected, // el servicio deleccionado en string
      dayIsSelected: dayIsSelected, // [31, 2] array en su 0 dice la fecha, en su 1 dice el mes
    });
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
            backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <Button
              onClick={handleClose}
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
                  color: darkMode.on ? "white" : darkMode.dark,
                }}
              >
                Horarios para el:
              </h2>
              <h2
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: darkMode.on ? "white" : darkMode.dark,
                }}
              >
                {`${dayIsSelected[0]}/${dayIsSelected[1]}`}
              </h2>
            </Box>
            <hr style={{ marginBottom: "2px" }} />
          </Box>
          {buttons.length > 0 ? (
            <Box sx={{ maxHeight: !sm ? "40vh" : "60%", overflow: "scroll" }}>
              {buttons.map((buttonGroup, index) => (
                <Box
                  key={index}
                  sx={{
                    height: "160px",
                    border: "2px solid #2196f3",
                    borderRadius: "5px",
                    padding: "4px",
                    marginTop: "15px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {buttonGroup.map((button, buttonIndex) => {
                    if (buttonIndex === 1) {
                      return (
                        <Box
                          key={buttonIndex}
                          sx={{
                            display: "flex",
                            height: "30%",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}
                        >
                          <h2
                            key={button}
                            style={{
                              overflow: "hidden",
                              color: darkMode.on ? "white" : darkMode.dark,
                            }}
                          >
                            {button}
                          </h2>
                          <img
                            src={
                              buttonGroup[buttonIndex + 1]
                                ? buttonGroup[buttonIndex + 1]
                                : NoUser
                            }
                            alt="Profesional"
                            style={{ width: "40px", borderRadius: "50px" }}
                          />
                        </Box>
                      );
                    }
                  })}
                  <Box className="box-to-scroll" style={{ height: "70%" }}>
                    <ShowTimeCarousel
                      selectedWorker={selectedWorker}
                      buttonGroup={buttonGroup.slice(3)}
                      selectedTime={selectedTime}
                      setSelectedTime={setSelectedTime}
                      handleSelectTime={handleSelectTime}
                      button0={buttonGroup[0]}
                      button1={buttonGroup[1]}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box>
              <Skeleton
                variant="rounded"
                height={140}
                style={{ marginTop: "10px" }}
              />
            </Box>
          )}
          <Box
            sx={{
              height: "30%",
              width: "100%",
              marginTop: "40px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                style={{
                  margin: "5px",
                  fontFamily: "Jost,sans-serif",
                  fontWeight: "bold",
                  textTransform: "lowercase",
                  color: darkMode.on ? "black" : "white",
                  backgroundColor: darkMode.on ? "white" : "black",
                  pointerEvents: "none",
                }}
              >
                {serviceSelected}
              </Button>

              <Button
                variant="contained"
                style={{
                  margin: "5px",
                  fontFamily: "Jost,sans-serif",
                  fontWeight: "bold",
                  textTransform: "lowercase",
                  color: darkMode.on ? "black" : "white",
                  backgroundColor: darkMode.on ? "white" : "black",
                  pointerEvents: "none",
                }}
              >
                {dayIsSelected[0]}/{dayIsSelected[1]}
              </Button>

              <Button
                variant="contained"
                style={{
                  margin: "5px",
                  fontFamily: "Jost,sans-serif",
                  fontWeight: "bold",
                  textTransform: "lowercase",
                  color: darkMode.on ? "black" : "white",
                  backgroundColor: darkMode.on ? "white" : "black",
                  pointerEvents: "none",
                }}
              >
                {formatHour(selectedTime)}
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              {selectedTime ? (
                <Box>
                  <Button
                    variant="contained"
                    style={{
                      margin: "5px",
                      fontFamily: "Jost,sans-serif",
                      fontWeight: "bold",
                      textTransform: "lowercase",
                      color: darkMode.on ? "black" : "white",
                      backgroundColor: darkMode.on ? "white" : "black",
                      pointerEvents: "none",
                    }}
                  >
                    {selectedWorkerName}
                  </Button>
                </Box>
              ) : (
                <Box></Box>
              )}
              <Button
                onClick={() => {
                  handleAsignTurn(), handleClose();
                }}
                disabled={selectedTime && selectedTime != "" ? false : true}
                variant="contained"
                sx={{
                  display: "flex",
                  height: sm ? "45px" : "35px",
                  width: sm ? "120px" : "90px",
                  fontFamily: "Jost, sans serif",
                  fontSize: sm ? "17px" : "14px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                }}
              >
                aceptar
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ShowTurns;
