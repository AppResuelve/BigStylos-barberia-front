import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Button } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import { LoaderUserReady } from "../loaders/loaders";
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
  const [selectedTimes, setSelectedTimes] = useState({
    ini: "",
    end: "",
    ini2: "",
    end2: "",
  });
  const [isLoading, setIsLoading] = useState({
    count: false,
    turns: false,
  });

  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        count: true,
      }));
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: userData.email }
        );
        setCount(response.data);
        setSelectedDay(response.data[0].day); // Selecciona el primer día al inicio
        setSelectedTimes({
          ini: response.data[0].ini,
          end: response.data[0].end,
          ini2: response.data[0].ini2,
          end2: response.data[0].end2,
        });
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        count: false,
      }));
    };
    fetchCount();
    if (refreshWhoIsComing === true) {
      setRefreshWhoIsComing(false);
    }
  }, [refreshWhoIsComing]);

  useEffect(() => {
    const fetchTurns = async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        turns: true,
      }));
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/whoiscoming`,
          { emailWorker: userData.email, month: numberMonth, day: numberDay }
        );
        setTurns(response.data);
      } catch (error) {
        console.error("Error al obtener los turnos.", error);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        turns: false,
      }));
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
      end2: element.end2,
    });
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
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "50px",
          overflow: "auto",
          backgroundColor: isLoading.count
            ? ""
            : count.length < 1
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
          <span
            style={{
              display: "flex",
              margin: "0 auto",
              alignItems: "center",
              color: "white",
              fontSize: "18px",
            }}
          >
            No tienes días creados
          </span>
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
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "left",
            }}
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
      <div
        style={{
          display: selectedDay !== "" ? "block" : "none",
          overflow: "scroll",
          height: isLoading.turns
            ? "50px"
            : turns.length < 1
            ? "50px"
            : "fit-content",
          maxHeight: "350px",
          backgroundColor: isLoading.turns
            ? ""
            : turns.length < 1
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
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoaderUserReady />
          </div>
        ) : turns.length > 0 ? (
          <table>
            <thead style={{ pointerEvents: "none" }}>
              <tr>
                <th style={{ maxWidth: "200px" }}>Cliente</th>
                <th style={{ minWidth: "120px" }}>Horario</th>
                <th style={{ minWidth: "160px" }}>Celular</th>
                <th style={{ minWidth: "180px" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {turns.map((turn, index) => (
                <tr key={index}>
                  <td
                    style={{
                      maxWidth: "200px",
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
                      <span>{turn.name}</span>
                    </td>
                  </td>
                  <td
                    style={{
                      maxWidth: "180px",
                      overflowX: "hidden",
                    }}
                  >{`${formatHour(turn.ini)} - ${formatHour(turn.end)}`}</td>
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
                    {turn.email}
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

export default WhoIsComingWorker;
