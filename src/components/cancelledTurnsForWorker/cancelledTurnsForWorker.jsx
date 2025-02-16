import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Button } from "@mui/material";
import { LoaderUserReady } from "../loaders/loaders";
import { WhatsApp } from "@mui/icons-material";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CancelledTurnsForWorker = ({ userData, refreshWhoIsComing }) => {
  const { darkMode } = useContext(ThemeContext);
  const [selectedDay, setSelectedDay] = useState("");
  const [cancelledTurnsByDays, setCancelledTurnsByDays] = useState([]);
  const [count, setCount] = useState([]);
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
          `${VITE_BACKEND_URL}/cancelledturns/getcount`,
          { emailWorker: userData.email }
        );
        setCount(response.data);
        if (response.data.length !== 0) {
          setSelectedDay(response.data[0]); // Usa el primer día si está disponible
        }
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        count: false,
      }));
    };
    fetchCount();
  }, [refreshWhoIsComing]);

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
            { emailWorker: userData.email, month: numberMonth, day: numberDay }
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
  }, [selectedDay]);

  const handleChangeDay = (element) => {
    setSelectedDay(element);
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
            No tienes días con turnos cancelados
          </span>
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
                <th style={{ maxWidth: "180px" }}>Usuario que canceló</th>
                <th style={{ minWidth: "180px" }}>Profesional</th>
                <th style={{ minWidth: "120px" }}>Horario</th>
                <th style={{ minWidth: "160px" }}>Celular</th>
                <th style={{ minWidth: "180px" }}>Email Usuario</th>
              </tr>
            </thead>
            <tbody>
              {cancelledTurnsByDays.map((turn, index) => (
                <tr key={index}>
                  <td
                    style={{
                      maxWidth: "200px",
                      textOverflow: "ellipsis",
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

export default CancelledTurnsForWorker;
