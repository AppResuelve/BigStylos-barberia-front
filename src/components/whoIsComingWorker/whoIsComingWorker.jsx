import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { WhatsApp } from "@mui/icons-material";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "../whoIsComingAdmin/whoIsComing.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingWorker = ({ user, refreshForWhoIsComing, setRefreshForWhoIsComing }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [turns, setTurns] = useState([]);
  /*  turns contiene:
  {
    email: el email del cliente
    name: el name del cliente
    ini: el minuto de inicio de su turno
    fin: minuto final de su turno
    phone: su cel
    image: su imagen
  } */
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  const date = new Date();
  const currentDay = date.getDate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: user.email }
        );
        const { data } = response;
        setCount(data);
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    fetchCount();
    if (refreshForWhoIsComing == true) {
      setRefreshForWhoIsComing(false)
    }
  }, [refreshForWhoIsComing]);

  useEffect(() => {
    const fetchTurns = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/whoiscoming`,
          { emailWorker: user.email, month: numberMonth, day: numberDay }
        );
        const { data } = response;
        setTurns(data);
      } catch (error) {
        console.error("Error al obtener los dias cancelados.", error);
      }
    };
    if (selectedDay.length > 0) {
      fetchTurns();
    }
    if (refreshForWhoIsComing == true) {
      setRefreshForWhoIsComing(false)
    }
  }, [selectedDay, refreshForWhoIsComing]);

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
            display:"flex",
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
                    <h3 className="h-email-hic">Email</h3>
                    <hr />
                    <h3 className="h-time-hic">Horario</h3>
                    <hr />
                    <h3 className="h-phone-hic">Celular</h3>
                    <hr />
                    <h3 className="h-name-hic">Nombre</h3>
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
                <h4 className="h-email-hic">{element.email}</h4>
                <hr />
                <h4 className="h-time-hic">
                  {`${formatHour(element.ini)} - ${formatHour(element.fin)}`}
                </h4>
                <hr />
                <Box
                  className={darkMode.on ? "h-phone-hic-dark" : "h-phone-hic"}
                >
                  <a
                    href={`whatsapp://send?phone=${element.phone}&text=Recuerda que tienes reserva en la barbería, revisa en la página, sección "Mis Turnos".`}
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
                </Box>

                <hr />
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={element.image}
                    alt="imagen de perfil"
                    style={{ width: "30px", borderRadius: "50px" }}
                  ></img>
                  <h4 className="h-name-hic">{element.name}</h4>
                </Box>
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
              No tiene turnos para este día
            </h4>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default WhoIsComingWorker;
