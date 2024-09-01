import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Button, Box } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import axios from "axios";
import "../cancelledTurnsForAdmin/cancelledTurns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CancelledTurnsForWorker = ({ userData }) => {
  const { darkMode } = useContext(ThemeContext);
  const [cancelledTurnsByDays, setCancelledTurnsByDays] = useState([]);
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  const date = new Date();
  const currentDay = date.getDate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/cancelledturns/getcount`,
          { emailWorker: userData.email }
        );
        const { data } = response;
        setCount(data);
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const fetchCancelled = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/cancelledturns/getforworker`,
          { emailWorker: userData.email, month: numberMonth, day: numberDay }
        );
        const { data } = response;
        setCancelledTurnsByDays(data);
      } catch (error) {
        console.error("Error al obtener los dias cancelados.", error);
      }
    };
    if (selectedDay.length > 0) {
      fetchCancelled();
    }
  }, [selectedDay]);

  const handleChangeDay = (element) => {
    setSelectedDay(element);
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
          overFlow: "scroll",
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
          {count.length > 0 &&
            count.map((element, index) => {
              return (
                <Button
                  variant="contained"
                  key={index}
                  style={{
                    backgroundColor:
                      selectedDay == element && darkMode.on
                        ? "white"
                        : selectedDay == element && !darkMode.on
                        ? "black"
                        : "",
                    color:
                      selectedDay == element && darkMode.on ? "black" : "white",
                    margin: "5px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    handleChangeDay(element);
                  }}
                >
                  {element}
                </Button>
              );
            })}
          {count.length < 1 && (
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            >
              Todavía no tienes dias
            </h2>
          )}
        </Box>
      </Box>
      <Box
        className="box-container-ctfw"
        sx={{
          width: "100%",
          overFlow: "scroll",
        }}
      >
        <Box style={{ overflow: "scroll", maxHeight: "350px" }}>
          {cancelledTurnsByDays.length > 0 &&
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
                      <h3 className="h-email-ctfw">Email</h3>
                      <hr />
                      <h3 className="h-whocancelled-ctfw">Quien canceló?</h3>
                      <hr />
                      <h3 className="h-phone-ctfw">Celular</h3>
                      <hr />
                      <h3 className="h-day-ctfw">Día</h3>
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
                  <h4 className="h-email-ctfw">{element.email}</h4>
                  <hr />
                  <h4 className="h-whocancelled-ctfw">
                    {element.howCancelled}
                  </h4>
                  <hr />
                  <Box
                    className={
                      darkMode.on ? "h-phone-ctfw-dark" : "h-phone-ctfw"
                    }
                  >
                    {element.phone !== "no requerido" ? (
                      <a
                        href={`whatsapp://send?phone=${element.phone}&text=Su turno para la barbería ha sido cancelado, por favor realice una nueva reserva.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <button
                          className={
                            element.phone === "no requerido"
                              ? "btn-wsp-ctfw-false"
                              : "btn-wsp-ctfw"
                          }
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
                          <h4>{element.phone}</h4>
                          {element.phone !== "no requerido" && (
                            <WhatsApp color="success" />
                          )}
                        </button>
                      </a>
                    ) : (
                      <h4>{element.phone}</h4>
                    )}
                  </Box>

                  <hr />
                  <h4 className="h-day-ctfw">{selectedDay}</h4>
                </Box>
                <hr className="hr-ctfw" />
              </Box>
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default CancelledTurnsForWorker;
