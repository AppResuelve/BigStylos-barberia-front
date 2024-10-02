import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Skeleton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import formatHour from "../../functions/formatHour";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import axios from "axios";
import "./myTurns.css";
import Swal from "sweetalert2";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTurns = ({ userData }) => {
  const { darkMode } = useContext(ThemeContext);
  const [listMyTurns, setListMyTurns] = useState(1);
  const { sm } = useMediaQueryHook();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/myturns`,
          { emailUser: userData.email }
        );
        setListMyTurns(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (Object.keys(userData).length > 0) {
      fetchData();
    }
  }, [userData, refresh]);

  const handleSubmit = async (turn) => {
    Swal.fire({
      title: "Estas a punto de cancelar el turno, deseas continuar?",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Continuar",
      denyButtonText: `Volver`,
      customClass: {
        container: "my-swal-container",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/workdays/cancel`,
            {
              month: turn.month,
              day: turn.day,
              ini: turn.ini,
              end: turn.end,
              emailWorker: turn.worker.email,
              nameWorker: turn.worker.name,
              emailUser: userData.email,
              nameUser: userData.name,
              service: turn.service,
            }
          );
          setRefresh(!refresh);
          Swal.fire({
            title: "Su turno ha sido cancelado exitosamente!",
            icon: "success",
            timer: 3000,
            showDenyButton: false,
            showConfirmButton: false,
            toast: true,
            position: "bottom-end",
            customClass: {
              container: "my-swal-container",
            },
          });
          const res = await axios.post(
            `${VITE_BACKEND_URL}/pushnotifications/send`,
            {
              addressee: turn.worker.email,
              messageData: {
                title: `${userData.name} ha cancelado un turno.`,
                body: `El ${turn.service.name} del ${turn.day}/${turn.month} a las ${turn.ini} ha quedado libre.`,
              },
            }
          );
        } catch (error) {
          Swal.fire({
            title: "Error al cancelar el turno",
            icon: "error",
            timer: 3000,
            showDenyButton: false,
            showConfirmButton: false,
            toast: true,
            position: "bottom-end",
            customClass: {
              container: "my-swal-container",
            },
          });
          console.error("Error al cancelar el turno:", error);
        }
      }
    });
  };

  return (
    <div className="div-container-myturns">
      <div>
        {listMyTurns === 1 ? (
          <Skeleton variant="rounded" height={80} style={{ width: "100%" }} />
        ) : listMyTurns && listMyTurns.length > 0 ? (
          listMyTurns.map((turn, index) => {
            return (
              <div key={index} className="box-container-turn-myTurns">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span id="servicename">{turn.service.name}</span>
                  <span className="h4-myTurns">
                    El día: {turn.day}/{turn.month} a las {formatHour(turn.ini)}
                  </span>
                </div>
                <hr style={{ width: "100%" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px",
                  }}
                >
                  <div className={"ticker-container"}>
                    <span>Profesional:</span>
                    <span>{turn.worker.name}</span>
                  </div>
                  <button
                    className="btn-cancel-myTurns"
                    onClick={() => handleSubmit(turn)}
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h4
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: darkMode.on ? "white" : darkMode.dark,
              height: "80px",
            }}
          >
            No tienes turnos todavía
          </h4>
        )}
      </div>
    </div>
  );
};

export default MyTurns;
