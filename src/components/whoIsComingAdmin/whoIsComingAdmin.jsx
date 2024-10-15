import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Box } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "./whoIsComing.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingAdmin = ({ refreshWhoIsComing }) => {
  const { darkMode } = useContext(ThemeContext);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [turns, setTurns] = useState([]);
  const [count, setCount] = useState([]);

  // Fetch workers data
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/users/getworkers`
        );
        setWorkers(response.data);
      } catch (error) {
        console.error("Error fetching workers.", error);
      }
    };
    fetchWorkers();
  }, [refreshWhoIsComing]);

  // Fetch count of available days for the selected worker
  useEffect(() => {
    const fetchCount = async () => {
      if (selectedWorker) {
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/workdays/countworker`,
            { emailWorker: selectedWorker }
          );
          setCount(response.data);
          setSelectedDay(""); // Reset selected day
          setTurns([]); // Clear turns when changing worker
        } catch (error) {
          console.error("Error fetching count.", error);
        }
      }
    };
    fetchCount();
  }, [selectedWorker]);

  // Fetch turns for the selected worker and day
  useEffect(() => {
    const fetchTurns = async () => {
      if (selectedDay) {
        const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/workdays/whoiscoming`,
            { emailWorker: selectedWorker, month: numberMonth, day: numberDay }
          );
          setTurns(response.data);
        } catch (error) {
          console.error("Error fetching turns.", error);
        }
      }
    };
    fetchTurns();
  }, [selectedDay, selectedWorker]);

  // Handle worker selection
  const handleChangeWorker = (email) => {
    setSelectedWorker(email);
  };

  // Handle day selection
  const handleChangeDay = (day) => {
    setSelectedDay(day);
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

        <Box style={{ display: "flex", width: "100%", maxWidth: "900px", overflow: "auto", marginTop: "20px" }}>
          {count.length > 0 &&
            count.map((day, index) => (
              <button
                key={index}
                className="btn-day-wic"
                style={{
                  backgroundColor: selectedDay === day ? (darkMode.on ? "white" : "black") : "",
                  color: selectedDay === day ? "white" : "black",
                }}
                onClick={() => handleChangeDay(day)}
              >
                {day}
              </button>
            ))}
          {count.length < 1 && selectedWorker && (
            <h2 style={{ display: "flex", justifyContent: "center", padding: "10px", color: darkMode.on ? "white" : darkMode.dark }}>
              Todavía no hay días
            </h2>
          )}
        </Box>

        <Box style={{ overflow: "scroll", maxHeight: "350px", marginTop: "20px" }}>
          {turns.length > 0 ? (
            turns.map((turn, index) => (
              <Box key={index}>
                {index === 0 && (
                  <Box>
                    <Box style={{ display: "flex", color: darkMode.on ? "white" : darkMode.dark }}>
                      <h3 className="h-name-hic">Nombre</h3>
                      <hr />
                      <h3 className="h-time-hic">Horario</h3>
                      <hr />
                      <h3 className="h-phone-hic">Celular</h3>
                      <hr />
                      <h3 className="h-email-hic">Email</h3>
                    </Box>
                    <hr className="hr-hic" />
                  </Box>
                )}
                <Box style={{ display: "flex", color: darkMode.on ? "white" : darkMode.dark }}>
                  <Box className="h-name-hic" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4>{turn.name}</h4>
                    <img
                      src={turn.image ? turn.image : noUserImg}
                      alt="Profile"
                      style={{
                        width: "30px",
                        borderRadius: "50px",
                        backgroundColor: turn.image ? "" : (darkMode.on ? "white" : ""),
                      }}
                    />
                  </Box>
                  <hr />
                  <h4 className="h-time-hic">
                    {`${formatHour(turn.ini)} - ${formatHour(turn.end)}`}
                  </h4>
                  <hr />
                  <Box className={darkMode.on ? "h-phone-hic-dark" : "h-phone-hic"}>
                    {turn.phone ? (
                      <a
                        href={`whatsapp://send?phone=${turn.phone}&text=Recuerda que tienes reserva en la barbería, revisa en la página, sección "Mis Turnos".`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <button
                          className={turn.phone === "no requerido" ? "btn-wsp-ctfw-false" : "btn-wsp-ctfw"}
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
                          <h4>{turn.phone}</h4>
                          {turn.phone !== "no requerido" && <WhatsApp color="success" />}
                        </button>
                      </a>
                    ) : (
                      <span>No disponible</span>
                    )}
                  </Box>
                  <hr />
                  <h4 className="h-email-hic">{turn.email}</h4>
                </Box>
                <hr className="hr-hic" />
              </Box>
            ))
          ) : (
            selectedDay && (
              <Box style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                <h4 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                  No tienes turnos para este día
                </h4>
              </Box>
            )
          )}
        </Box>
      </div>
    </div>
  );
};

export default WhoIsComingAdmin;
