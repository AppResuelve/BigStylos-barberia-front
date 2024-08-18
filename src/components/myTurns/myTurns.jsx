import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Box, Button, Skeleton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import formatHour from "../../functions/formatHour";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import "./myTurns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTurns = ({ userData }) => {
  const {
    darkMode,
    setShowAlert,
    validateAlert,
    setValidateAlert,
    refreshWhenCancelTurn,
    setRefreshWhenCancelTurn,
    disableButtonMyTurns,
    setDisableButtonMyTurns,
  } = useContext(DarkModeContext);
  const [listMyTurns, setListMyTurns] = useState(1);
  const [infoToSubmit, setInfoToSubmit] = useState({});
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
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

  useEffect(() => {
    if (validateAlert === true) {
      handleSubmit();
      setValidateAlert(false);
    }
  }, [validateAlert]);

  const handleConfirmCancelTurn = (turn) => {
    setInfoToSubmit(turn);
    setShowAlert({
      isOpen: true,
      message: "Estas a punto de cancelar el turno, deseas continuar?",
      type: "error",
      button1: {
        text: "Confirmar",
        action: "handleActionProp",
      },
      buttonClose: {
        text: "Cancelar",
      },
      stateName: "validateAlert",
    });
    setDisableButtonMyTurns(true);
  };

  const handleSubmit = async (turn) => {
    console.log(turn);
    
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/workdays/cancel`, {
        month: turn.month,
        day: turn.day,
        ini: turn.ini,
        end: turn.end,
        emailWorker: turn.worker.email,
        emailUser: userData.email,
      });

      // // Filtrar los turnos para eliminar el turno cancelado
      // existingTurns = existingTurns.filter((turn) => {
      //   const serviceName = Object.keys(turn)[0];
      //   const { month, day, ini } = turn[serviceName];
      //   return (
      //     month !== infoToSubmit.month ||
      //     day !== infoToSubmit.day ||
      //     ini !== infoToSubmit.hourTime.ini
      //   );
      // });

      setRefresh(!refresh);
      setRefreshWhenCancelTurn(!refreshWhenCancelTurn);
      // const timeoutId = setTimeout(() => {
      //   setShowAlert({
      //     isOpen: true,
      //     message: `Su turno ha sido cancelado exitosamente!`,
      //     type: "success",
      //     button1: {
      //       text: "",
      //       action: "",
      //     },
      //     buttonClose: {
      //       text: "aceptar",
      //     },
      //   });
      // }, 450);

      // return () => {
      //   clearTimeout(timeoutId);
      // };
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
    }
  };
console.log(listMyTurns,"lista de mis turnosssssssssssssss");

  return (
    <div className="div-container-myturns">
      <Box style={{ overflow: "auto" }}>
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
                  <Button
                    disabled={disableButtonMyTurns ? true : false}
                    className="btn-cancel-myTurns"
                    sx={{
                      marginLeft: "5px",
                      display: "flex",
                      alignSelf: "end",
                      borderRadius: "5px",
                      color: "red",
                      transition: ".2s",
                    }}
                    onClick={() => handleSubmit(turn)}
                  >
                    <DeleteOutlineIcon />
                  </Button>
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
      </Box>
    </div>
  );
};

export default MyTurns;


