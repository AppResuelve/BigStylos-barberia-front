import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Button, Box } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import axios from "axios";
import "./cancelledTurns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CancelledTurnsForAdmin = ({ refreshWhoIsComing }) => {
  const { darkMode } = useContext(ThemeContext);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [cancelledTurnsByDays, setCancelledTurnsByDays] = useState([]);
  const [count, setCount] = useState([]);
  console.log(count, "-----count")
  // const date = new Date();
  // const currentDay = date.getDate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/users/getworkers`
        );
        const { data } = response;
        setWorkers(data);
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    fetchWorkers();
  }, [refreshWhoIsComing]);

  useEffect(() => {
    const fetchCount = async () => {
      if (selectedWorker) {
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/cancelledturns/getcount`,
            { emailWorker: selectedWorker }
          );
          setCount(response.data);
          setSelectedDay(""); // Reset selected day
          setCancelledTurnsByDays([]); // Clear turns when changing worker
        } catch (error) {
          console.error("Error fetching count.", error);
        }
      }
    };
    fetchCount();
  }, [selectedWorker]);

  useEffect(() => {
    const fetchCancelledTurns = async () => {
      if (selectedDay) {
        const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/cancelledturns/getforworker`,
            { emailWorker: selectedWorker, month: numberMonth, day: numberDay }
          );
          setCancelledTurnsByDays(response.data);
        } catch (error) {
          console.error("Error fetching turns.", error);
        }
      }
    };
    fetchCancelledTurns();
  }, [selectedDay, selectedWorker]);

  const handleChangeWorker = (email) => {
    setSelectedWorker(email);
  };

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
        {/* ********************************************** */}
        <div className="box-container-ctfw">
        <div style={{ display: "flex", flexWrap: "wrap", overflowY: "scroll", maxHeight: "120px" }}>
          {workers.length > 0 &&
            workers.map((worker, index) => (
              <button
                className="btn-worker-wic"
                key={index}
                style={{
                  backgroundColor: selectedWorker === worker.email ? (darkMode.on ? "white" : "black") : "",
                  color: selectedWorker === worker.email ? (darkMode.on ? "black" : "white") : "white",
                }}
                onClick={() => handleChangeWorker(worker.email)}
              >
                <img src={worker.image} alt="Worker" />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "start", marginLeft: "5px" }}>
                  <span style={{ color: selectedWorker === worker.email ? "#a3a3a3" : "#727272" }}>
                    {worker.email}
                  </span>
                  <span style={{ color: selectedWorker === worker.email ? "#a3a3a3" : "#727272" }}>
                    {worker.name}
                  </span>
                </div>
              </button>
            ))}
        </div>
        </div>

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
          {count.length < 1 && selectedWorker !== "" && (
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            >
              Todavía no hay dias
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

export default CancelledTurnsForAdmin;
