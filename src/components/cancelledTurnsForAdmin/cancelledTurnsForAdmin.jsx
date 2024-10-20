import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import {
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WhatsApp } from "@mui/icons-material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { LoaderUserReady } from "../loaders/loaders";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CancelledTurnsForAdmin = ({ refreshWhoIsComing }) => {
  const { darkMode } = useContext(ThemeContext);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [cancelledTurnsByDays, setCancelledTurnsByDays] = useState([]);
  const [count, setCount] = useState([]);
  const [expanded, setExpanded] = useState("accordion");
  const { sm } = useMediaQueryHook();
  const [isLoading, setIsLoading] = useState({
    count: false,
    turns: false,
  });

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
      if (Object.keys(selectedWorker).length > 0) {
        setIsLoading((prevState) => ({
          ...prevState,
          count: true,
        }));
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/cancelledturns/getcount`,
            { emailWorker: selectedWorker.email }
          );
          setCount(response.data);
          setSelectedDay(""); // Reset selected day
          setCancelledTurnsByDays([]); // Clear turns when changing worker
        } catch (error) {
          console.error("Error fetching count.", error);
        }
        setIsLoading((prevState) => ({
          ...prevState,
          count: false,
        }));
      }
    };
    fetchCount();
  }, [selectedWorker]);

  useEffect(() => {
    const fetchCancelledTurns = async () => {
      if (selectedDay !== "") {
        setIsLoading((prevState) => ({
          ...prevState,
          turns: true,
        }));
        const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/cancelledturns/getforworker`,
            {
              emailWorker: selectedWorker.email,
              month: numberMonth,
              day: numberDay,
            }
          );
          setCancelledTurnsByDays(response.data);
        } catch (error) {
          console.error("Error fetching turns.", error);
        }
        setIsLoading((prevState) => ({
          ...prevState,
          turns: false,
        }));
      }
    };
    fetchCancelledTurns();
  }, [selectedDay, selectedWorker]);

  const handleChangeWorker = (worker) => {
    setSelectedDay("")
    setCancelledTurnsByDays([])
    setSelectedWorker(worker);
    setExpanded("");
  };

  const handleChangeDay = (element) => {
    setSelectedDay(element);
    setExpanded("");
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <hr
        style={{
          margin: "10px auto 0px auto",
          border: "none",
          height: "2px",
          backgroundColor: "var(--accent-color)",
          width: "95%",
        }}
      />

      <Accordion
        style={{
          width: "100%",
          borderRadius: "15px",
          boxShadow: "0px 5px 10px -5px rgba(0,0,0,0.50)",
          backgroundColor: "var(--bg-color)",
          padding: "4px",
          margin: 0,
        }}
        expanded={expanded === "accordion"}
        onChange={handleChange("accordion")}
      >
        <AccordionSummary
          style={{
            borderRadius: "15px",
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
          display: Object.keys(selectedWorker).length > 0 ? "flex" : "none",
          width: "100%",
          height: "50px",
          overflow: "auto",
          backgroundColor: isLoading.count
            ? ""
            : count.length < 1 && Object.keys(selectedWorker).length > 0
            ? "var(--accent-color)"
            : "",
          borderRadius: "12px",
        }}
      >
        {isLoading.count ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <LoaderUserReady />
          </div>
        ) : count.length > 0 ? (
          count.map((element, index) => {
            const isSelected = selectedDay === element;
            return (
              <Button
                variant="contained"
                key={index}
                style={{
                  backgroundColor: isSelected
                    ? "var(--accent-color)"
                    : "var(--color-disponibility)",

                  color: "white",
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
                {element}
              </Button>
            );
          })
        ) : (
          Object.keys(selectedWorker).length > 0 && (
            <span
              style={{
                display: "flex",
                margin: "0 auto",
                height: "100%",
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
      <div
        style={{
          display: selectedDay !== "" ? "block" : "none",
          overflow: "scroll",
          height: isLoading.turns
            ? "50px"
            : cancelledTurnsByDays.length < 1
            ? "50px"
            : "fit-content",
          maxHeight: "350px",
          backgroundColor: isLoading.turns
            ? ""
            : cancelledTurnsByDays.length < 1
            ? "var(--accent-color)"
            : "var(--bg-color)",
          borderRadius: "12px",
        }}
      >
        {isLoading.turns ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <LoaderUserReady />
          </div>
        ) : cancelledTurnsByDays.length > 0 ? (
          <table>
            <thead style={{ pointerEvents: "none" }}>
              <tr>
                <th style={{ maxWidth: "180px" }}>Quien canceló</th>
                <th style={{ minWidth: "180px" }}>Profesional</th>
                <th style={{ minWidth: "120px" }}>Horario</th>
                <th style={{ minWidth: "160px" }}>Celular</th>
                <th style={{ minWidth: "180px" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {cancelledTurnsByDays.map((turn, index) => (
                <tr key={index}>
                  <td
                    style={{
                      maxWidth: "250px",
                      overflowX: "hidden",
                      padding: 0,
                      border: "none",
                    }}
                  >
                    <td
                      style={{
                        display: "flex",
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
                          filter: turn.image ? "" : "var(--filter-invert)",
                        }}
                      />
                      <span>{turn.howCancelled}</span>
                    </td>
                  </td>
                  <td
                    style={{
                      maxWidth: "250px",
                      overflowX: "hidden",
                      display: "flex",
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
                        filter: turn.image ? "" : "var(--filter-invert)",
                      }}
                    />
                    <span>{turn.nameWorker}</span>
                  </td>
                  <td
                    style={{
                      maxWidth: "180px",
                      overflowX: "hidden",
                    }}
                  >{`${formatHour(turn.turn.ini)} - ${formatHour(
                    turn.turn.end
                  )}`}</td>
                  <td
                    style={{
                      maxWidth: "180px",
                      overflowX: "hidden",
                    }}
                  >
                    {turn.phone !== "no requerido" ? (
                      <a
                        href={`whatsapp://send?phone=${turn.phone}&text=Recuerda que tienes reserva en la barbería, revisa en la página, sección "Mis Turnos".`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <button className="btn-wsp-ctfw">
                          <WhatsApp color="success" />
                          <span>{turn.phone}</span>
                        </button>
                      </a>
                    ) : (
                      turn.phone
                    )}
                  </td>
                  <td
                    style={{
                      maxWidth: "220px",
                      overflowX: "hidden",
                    }}
                  >
                    {turn.emailUser}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedDay !== "" && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                color: "white",
                fontSize: "18px",
              }}
            >
              No hay turnos para este día
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default CancelledTurnsForAdmin;
