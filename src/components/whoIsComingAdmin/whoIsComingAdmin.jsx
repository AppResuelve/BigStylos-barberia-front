import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import {
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "./whoIsComing.css";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { LoaderUserReady } from "../loaders/loaders";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingAdmin = ({ refreshWhoIsComing }) => {
  const { darkMode } = useContext(ThemeContext);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimes, setSelectedTimes] = useState({
    ini: "",
    end: "",
    ini2: "",
    end2: "",
  });
  const [turns, setTurns] = useState([]);
  const [count, setCount] = useState([]);
  const [expanded, setExpanded] = useState("");
  const { sm } = useMediaQueryHook();
  const [isLoading, setIsLoading] = useState(false);

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
      if (Object.keys(selectedWorker).length > 0) {
        setIsLoading(true);
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/workdays/countworker`,
            { emailWorker: selectedWorker.email }
          );
          setCount(response.data);
          setSelectedDay(""); // Reset selected day
          setTurns([]); // Clear turns when changing worker
          setIsLoading(false);
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
            {
              emailWorker: selectedWorker.email,
              month: numberMonth,
              day: numberDay,
            }
          );
          setTurns(response.data);
        } catch (error) {
          console.error("Error fetching turns.", error);
        }
      }
    };
    fetchTurns();
  }, [selectedDay, selectedWorker]);

  const handleChangeWorker = (worker) => {
    setSelectedWorker(worker);
    setExpanded("");
  };

  const handleChangeDay = (element) => {
    setSelectedDay(element.day);
    setSelectedTimes({
      ini: element.ini,
      end: element.end,
      ini2: element.ini2,
      end2: element.end2,
    });
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  console.log(isLoading);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <hr
        style={{
          margin: "10px auto 0px auto",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
          width: "95%",
        }}
      />
      <Accordion
        style={{
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0px 5px 10px -5px rgba(0,0,0,0.50)",
          backgroundColor: "var(--bg-color)",
          padding: "4px",
        }}
        expanded={expanded === "accordion"}
        onChange={handleChange("accordion")}
      >
        <AccordionSummary
          style={{
            borderRadius: "20px",
            backgroundColor:
              expanded === "accordion"
                ? "var( --bg-color-hover)"
                : "var(--transparent)",
          }}
          expandIcon={
            <ExpandMoreIcon
              fontSize="large"
              sx={{
                color:
                  expanded === "accordion"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="accordionbh-content"
          id="accordionbh-header"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {Object.keys(selectedWorker).length > 0 && (
              <img
                src={selectedWorker.image}
                alt={selectedWorker.name}
                style={{ width: "35px", borderRadius: "35px" }}
              />
            )}
            <span>
              {Object.keys(selectedWorker).length > 0
                ? selectedWorker.name
                : "Seleccione un profesional"}
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <div className="container-workers-turns">
            {workers.length > 0 &&
              workers.map((worker, index) => {
                return (
                  <div
                    key={index}
                    className="select-workers-turns"
                    onClick={() => handleChangeWorker(worker)}
                    style={{
                      width: sm ? "100%" : "fit-content",
                      backgroundColor:
                        selectedWorker.email === worker.email
                          ? "var(--accent-color)"
                          : "var(--bg-color)",
                    }}
                  >
                    <img src={worker.image} alt={worker.name} />
                    <span>{worker.name}</span>
                  </div>
                );
              })}
          </div>
        </AccordionDetails>
      </Accordion>
      <div
        style={{
          display: "flex",
          width: "100%",
          overflow: "auto",
          backgroundColor:
            count.length < 1 && Object.keys(selectedWorker).length > 0
              ? "var(--accent-color)"
              : "",
          borderRadius: "12px",
        }}
      >
        {isLoading ? (
          <LoaderUserReady />
        ) : count.length > 0 ? (
          count.map((element, index) => {
            const isSelected = selectedDay === element.day;
            return (
              <Button
                variant="contained"
                key={index}
                style={{
                  backgroundColor: isSelected
                    ? "var(--accent-color)"
                    : element.turn
                    ? "var(--color-disponibility)"
                    : "var(--bg-color)",
                  color:
                    isSelected || element.turn ? "white" : "var(--text-color)",
                  margin: "5px",
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                  letterSpacing: "1.5px",
                  height: "40px",
                  borderRadius: "10px",
                  minWidth: "60px",
                  maxWidth: "60px",
                }}
                onClick={() => handleChangeDay(element)}
              >
                {element.day}
              </Button>
            );
          })
        ) : (
          Object.keys(selectedWorker).length > 0 && (
            <span
              style={{
                display: "flex",
                height: "40px",
                margin: "0 auto",
                alignItems: "center",
                color: "white",
                fontSize: "18px",
              }}
            >
              El profesional no tiene días creados
            </span>
          )
        )}
      </div>
      {Object.keys(selectedDay).length > 0 && (
        <div
          style={{
            backgroundColor: "var(--bg-color)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "10px",
            borderRadius: "15px",
            gap: "10px",
          }}
        >
          <span
            style={{ fontSize: "18px", fontWeight: "bold", textAlign: "left" }}
          >
            Horario del Jornal:
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <span>
              {`De ${formatHour(selectedTimes.ini)}hs a ${formatHour(
                selectedTimes.end
              )}hs`}
            </span>
            {selectedTimes.ini2 && selectedTimes.end2 && (
              <span>
                {`y de ${formatHour(selectedTimes.ini2)}hs a ${formatHour(
                  selectedTimes.end2
                )}hs`}
              </span>
            )}
          </div>
        </div>
      )}
      {turns.length > 0 ? (
        <div
          style={{
            overflow: "scroll",
            maxHeight: "350px",
            backgroundColor: "var(--bg-color)",
            borderRadius: "10px",
          }}
        >
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
          {turns.map((turn, index) => (
            <Box key={index}>
              <Box
                style={{
                  display: "flex",
                }}
              >
                <div
                  className="h-name-hic"
                  style={{
                    display: "flex",
                    // justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <img
                    src={turn.image ? turn.image : noUserImg}
                    alt="Profile"
                    style={{
                      width: "30px",
                      borderRadius: "50px",
                    }}
                  />
                  <span>{turn.name}</span>
                </div>
                <hr />
                <span className="h-time-hic">
                  {`${formatHour(turn.ini)} - ${formatHour(turn.end)}`}
                </span>
                <hr />
                <div
                  className={darkMode.on ? "h-phone-hic-dark" : "h-phone-hic"}
                >
                  {turn.phone ? (
                    <a
                      href={`whatsapp://send?phone=${turn.phone}&text=Recuerda que tienes reserva en la barbería, revisa en la página, sección "Mis Turnos".`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <button
                        className={
                          turn.phone === "no requerido"
                            ? "btn-wsp-ctfw-false"
                            : "btn-wsp-ctfw"
                        }
                      >
                        {turn.phone !== "no requerido" && (
                          <WhatsApp color="success" />
                        )}
                        <span>{turn.phone}</span>
                      </button>
                    </a>
                  ) : (
                    <span>No disponible</span>
                  )}
                </div>
                <hr />
                <span className="h-email-hic">{turn.email}</span>
              </Box>
              <hr className="hr-hic" />
            </Box>
          ))}
        </div>
      ) : (
        selectedDay !== "" && (
          <span
            style={{
              display: "flex",
              margin: "0 auto",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "var(--accent-color)",
              borderRadius: "12px",
              height: "40px",
              color: "white",
              fontSize: "18px",
            }}
          >
            No hay turnos para este día
          </span>
        )
      )}
    </div>
  );
};

export default WhoIsComingAdmin;
