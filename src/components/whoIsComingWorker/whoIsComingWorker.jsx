import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Button, Box } from "@mui/material";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "../whoIsComingAdmin/whoIsComing.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingWorker = ({
  userData,
  refreshWhoIsComing,
  setRefreshWhoIsComing,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const [turns, setTurns] = useState([]);
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimes, setSelectedTimes] = useState({ ini: "", end: "", ini2: "", end2: "" });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: userData.email }
        );
        const { data } = response;
        setCount(data);
        setSelectedDay(data[0].day); // Selecciona el primer día al inicio
        setSelectedTimes({
          ini: data[0].ini,
          end: data[0].end,
          ini2: data[0].ini2,
          end2: data[0].end2
        });
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    fetchCount();
    if (refreshWhoIsComing === true) {
      setRefreshWhoIsComing(false);
    }
  }, [refreshWhoIsComing]);

  useEffect(() => {
    const fetchTurns = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/whoiscoming`,
          { emailWorker: userData.email, month: numberMonth, day: numberDay }
        );
        const { data } = response;
        setTurns(data);
      } catch (error) {
        console.error("Error al obtener los turnos.", error);
      }
    };
    if (selectedDay !== "" && selectedDay !== undefined) {
      fetchTurns();
    }
    if (refreshWhoIsComing === true) {
      setRefreshWhoIsComing(false);
    }
  }, [selectedDay, refreshWhoIsComing]);

  const handleChangeDay = (element) => {
    setSelectedDay(element.day);
    setSelectedTimes({
      ini: element.ini,
      end: element.end,
      ini2: element.ini2,
      end2: element.end2
    });
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
          {count.length > 0 &&
            count.map((element, index) => {
              const isSelected = selectedDay === element.day;

              return (
                <Button
                  variant="contained"
                  key={index}
                  style={{
                    backgroundColor: element.turn
                      ? isSelected
                        ? "#4caf50" // Verde cuando `turn` es true y seleccionado
                        : "#8bc34a" // Verde claro cuando `turn` es true y no seleccionado
                      : isSelected
                        ? "#f44336" // Rojo cuando `turn` es false y seleccionado
                        : "#e57373", // Rojo claro cuando `turn` es false y no seleccionado
                    color: "white",
                    margin: "5px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    letterSpacing: "1.5px",
                  }}
                  onClick={() => handleChangeDay(element)}
                >
                  {element.day}
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
              Todavía no tienes días
            </h2>
          )}
        </Box>
      </Box>
      <Box
        style={{ overflow: "scroll", maxHeight: "350px", marginTop: "20px" }}
      >
        <Box>
          <h3 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
            Horario del Jornal:
          </h3>
          <Box style={{ display: "flex", gap: "10px" }}> {/* Usamos flexbox */}
            <p style={{ color: darkMode.on ? "white" : darkMode.dark }}>
              {`De ${formatHour(selectedTimes.ini)} a ${formatHour(selectedTimes.end)}`}
            </p>
            {selectedTimes.ini2 && selectedTimes.end2 && (
              <p style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                {`y de ${formatHour(selectedTimes.ini2)} a ${formatHour(selectedTimes.end2)}`}
              </p>
            )}
          </Box>
        </Box>


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
                      marginLeft: "5px",
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
                  {element.ini2 && element.end2 && (
                    <>
                      <br />
                      {`${formatHour(element.ini2)} - ${formatHour(element.end2)}`}
                    </>
                  )}
                </h4>
                <hr />
                <Box
                  className={darkMode.on ? "h-phone-hic-dark" : "h-phone-hic"}
                >
                  {element.phone ? (
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
                      </button>
                    </a>
                  ) : (
                    <h5>--------------</h5>
                  )}
                </Box>

                <hr />
                <h4 className="h-email-hic">
                  {element.email ? element.email : "--------------"}
                </h4>
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
              No hay turnos para este día.
            </h4>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default WhoIsComingWorker;
