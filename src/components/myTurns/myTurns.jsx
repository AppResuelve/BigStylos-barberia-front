import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Box, Button, Skeleton } from "@mui/material";
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
  console.log(listMyTurns);

  return (
    <div className="div-container-myturns">
      <div>
        {listMyTurns === 1 ? (
          <Skeleton variant="rounded" height={80} style={{ width: "100%" }} />
        ) : listMyTurns && listMyTurns.length > 0 ? (
          listMyTurns.map((turn, index) => {
            return (
              <Box
                key={index}
                className="box-container-turn-myTurns"
                sx={{
                  backgroundColor: darkMode.on ? "white" : "#d6d6d5",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h3 className="h3-myTurns">{turn.service.name}</h3>
                  <h4 className="h4-myTurns">
                    El día: {turn.day}/{turn.month} a las {formatHour(turn.ini)}
                  </h4>
                  <hr style={{ width: "100%" }} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px",
                  }}
                >
                  <Box
                    className={sm ? "ticker-container" : ""}
                    sx={{ width: "80%" }}
                  >
                    <h4 className="h4-myTurns">Profesional:</h4>
                    <h4 className={sm ? "ticker-text" : "h4-myTurns"}>
                      {turn.worker.name}
                    </h4>
                  </Box>
                  <button
                    className="btn-cancel-myTurns"
                    onClick={() => handleSubmit(turn)}
                  >
                    <DeleteOutlineIcon />
                  </button>
                </Box>
              </Box>
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
