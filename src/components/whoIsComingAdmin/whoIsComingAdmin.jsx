import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { Button, Box } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "./whoIsComing.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingAdmin = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [turns, setTurns] = useState([]);
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [workers, setWorkers] = useState([]);

  const date = new Date();
  const currentDay = date.getDate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/users/getworkers`
        );
        setWorkers(response.data);
      } catch (error) {
        console.error("Error al obtener workers.", error);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: selectedWorker }
        );
        setCount(response.data);
        // setSelectedDay(data[0]);
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    if (selectedWorker !== "") {
      fetchCount();
    }
  }, [selectedWorker]);

  useEffect(() => {
    const fetchTurns = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/whoiscoming`,
          { emailWorker: selectedWorker, month: numberMonth, day: numberDay }
        );
        setTurns(response.data);
      } catch (error) {
        console.error("Error al obtener los dias cancelados.", error);
      }
    };
    //condicional de estado 0 de la app (undefined)
    if (selectedDay !== "") {
      fetchTurns();
    }
  }, [selectedDay]);

  const handleChangeDay = (element) => {
    setSelectedDay(element);
  };

  const handleChangeWorker = (email) => {
    setSelectedDay("");
    setTurns([]);
    setSelectedWorker(email);
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
        {/* **************** */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflowY: "scroll",
            maxHeight: "120px",
          }}
        >
          {workers.length > 0 &&
            workers.map((element, index) => {
              return (
                <button
                  className="btn-worker-wic"
                  key={index}
                  style={{
                    backgroundColor:
                      selectedWorker == element.email && darkMode.on
                        ? "white"
                        : selectedWorker == element.email && !darkMode.on
                        ? "black"
                        : "",
                    color:
                      selectedWorker == element.email && darkMode.on
                        ? "black"
                        : "white",
                  }}
                  onClick={() => {
                    handleChangeWorker(element.email);
                  }}
                >
                  <img src={element.image} alt="trabajador" />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      marginLeft: "5px",
                    }}
                  >
                    <span
                      id="email"
                      style={{
                        color:
                          selectedWorker == element.email
                            ? "#a3a3a3"
                            : "#727272",
                      }}
                    >
                      {element.email}
                    </span>
                    <span
                      style={{
                        color:
                          selectedWorker == element.email
                            ? "#a3a3a3"
                            : "#727272",
                      }}
                    >
                      {element.name}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>

        <Box
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "900px",
            overflow: "auto",
            marginTop: "20px",
          }}
        >
          {count.length > 0 &&
            count.map((element, index) => {
              const [numberDay, numberMonth] = element.split("/");

              return (
                <button
                  key={index}
                  className="btn-day-wic"
                  style={{
                    backgroundColor:
                      selectedDay == element && darkMode.on
                        ? "white"
                        : selectedDay == element && !darkMode.on
                        ? "black"
                        : "",
                    color: selectedDay == element ? "white" : "black",
                  }}
                  onClick={() => {
                    handleChangeDay(element);
                  }}
                >
                  {currentDay === numberDay ? "HOY" : element}
                </button>
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
        <Box
          style={{ overflow: "scroll", maxHeight: "350px", marginTop: "20px" }}
        >
          {turns.length > 0 &&
            turns.map((element, index) => (
              <Box key={index}>
                {index === 0 && (
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        color: darkMode.on ? "white" : darkMode.dark,
                      }}
                    >
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
                <Box
                  style={{
                    display: "flex",
                    color: darkMode.on ? "white" : darkMode.dark,
                  }}
                >
                  <Box
                    className="h-name-hic"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>{element.name}</h4>
                    <img
                      src={element.image ? element.image : noUserImg}
                      alt="imagen de perfil"
                      style={{
                        width: "30px",
                        borderRadius: "50px",
                        backgroundColor: element.image
                          ? ""
                          : darkMode.on
                          ? "white"
                          : "",
                      }}
                    ></img>
                  </Box>
                  <hr />
                  <h4 className="h-time-hic">
                    {`${formatHour(element.ini)} - ${formatHour(element.end)}`}
                  </h4>
                  <hr />
                  <Box
                    className={darkMode.on ? "h-phone-hic-dark" : "h-phone-hic"}
                  >
                    {element.phone ? (
                      <a
                        href={`whatsapp://send?phone=${element.phone}&text=Recuerda que tienes reserva en la barbería, revisa en la página, sección "Mis Turnos".e`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                        }}
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
                      <span>No disponible</span>
                    )}
                  </Box>

                  <hr />
                  <h4 className="h-email-hic">{element.email}</h4>
                </Box>
                <hr className="hr-hic" />
              </Box>
            ))}
          {turns.length < 1 && selectedDay !== "" && (
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <h4 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                No tienes turnos para este día
              </h4>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default WhoIsComingAdmin;
