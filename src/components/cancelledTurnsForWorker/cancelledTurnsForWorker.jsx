import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Button, Box, Typography } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import axios from "axios";
import "../cancelledTurnsForAdmin/cancelledTurns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CancelledTurnsForWorker = ({ userData, refreshWhoIsComing }) => {
  const { darkMode } = useContext(ThemeContext);
  const [cancelledTurnsByDays, setCancelledTurnsByDays] = useState([]);
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: userData.email }
        );
        const { data } = response;
        setCount(data);
        setSelectedDay(data[0]?.day); // Usa el primer día si está disponible
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    fetchCount();
  }, [refreshWhoIsComing]);

  const handleChangeDay = async (element) => {
    const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/cancelledturns/getforworker`,
        { emailWorker: userData.email, month: numberMonth, day: numberDay }
      );
      const { data } = response;
      setCancelledTurnsByDays(data);
      setSelectedDay(element);
    } catch (error) {
      console.error("Error al obtener los días cancelados.", error);
    }
  };

  return (
    <div>
      <hr
        style={{
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      <Box
        className="box-container-ctfw"
        style={{
          overflow: "scroll",
          marginBottom: "20px",
        }}
      >
        <Box
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "900px",
            overflow: "auto",
          }}
        >
          {count.length > 0 ? (
            count.map((element, index) => (
              <Button
                variant="contained"
                key={index}
                style={{
                  backgroundColor: selectedDay === element.day && darkMode.on ? "white" : selectedDay === element.day ? "black" : "",
                  color: selectedDay === element.day && darkMode.on ? "black" : "white",
                  margin: "5px",
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                }}
                onClick={() => handleChangeDay(element.day)}
              >
                {element.day}
              </Button>
            ))
          ) : (
            <Typography
              variant="h6"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            >
              Todavía no tienes días
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        className="box-container-ctfw"
        sx={{
          width: "100%",
          overflow: "scroll",
        }}
      >
        <Box style={{ overflow: "scroll", maxHeight: "350px" }}>
          {cancelledTurnsByDays.length > 0 ? (
            cancelledTurnsByDays.map((element, index) => (
              <Box key={index}>
                {index === 0 && (
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        color: darkMode.on ? "white" : darkMode.dark,
                      }}
                    >
                      <Typography variant="h6" className="h-email-ctfw">Email</Typography>
                      <hr />
                      <Typography variant="h6" className="h-whocancelled-ctfw">¿Quién canceló?</Typography>
                      <hr />
                      <Typography variant="h6" className="h-phone-ctfw">Celular</Typography>
                      <hr />
                      <Typography variant="h6" className="h-day-ctfw">Día</Typography>
                    </Box>
                    <hr className="hr-ctfw" />
                  </Box>
                )}
                <Box
                  style={{
                    display: "flex",
                    color: darkMode.on ? "white" : darkMode.dark,
                  }}
                >
                  <Typography variant="body1" className="h-email-ctfw">{element.email}</Typography>
                  <hr />
                  <Typography variant="body1" className="h-whocancelled-ctfw">{element.howCancelled}</Typography>
                  <hr />
                  <Box className={darkMode.on ? "h-phone-ctfw-dark" : "h-phone-ctfw"}>
                    {element.phone !== "no requerido" ? (
                      <a
                        href={`whatsapp://send?phone=${element.phone}&text=Su turno para la barbería ha sido cancelado, por favor realice una nueva reserva.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          className={element.phone === "no requerido" ? "btn-wsp-ctfw-false" : "btn-wsp-ctfw"}
                          style={{
                            fontFamily: "Jost, sans-serif",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body1">{element.phone}</Typography>
                          <WhatsApp color="success" />
                        </Button>
                      </a>
                    ) : (
                      <Typography variant="body1">{element.phone}</Typography>
                    )}
                  </Box>
                  <hr />
                  <Typography variant="body1" className="h-day-ctfw">{selectedDay}</Typography>
                </Box>
                <hr className="hr-ctfw" />
              </Box>
            ))
          ) : (
            <Typography
              variant="body1"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            >
              No hay turnos cancelados para este día.
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default CancelledTurnsForWorker;
