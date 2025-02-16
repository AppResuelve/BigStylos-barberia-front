import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import formatHour from "../../functions/formatHour";
import { Box, Button, MenuItem, Select } from "@mui/material";
import axios from "axios";
import toastAlert from "../../helpers/alertFunction";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OpeningAndClosing = ({ schedule, refresh, setRefresh, setRemaining }) => {
  const { darkMode, setShowAlert } = useContext(ThemeContext);
  const [showEdit, setShowEdit] = useState(false);
  const [timeEdit, setTimeEdit] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  const timeArray = [
    0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450,
    480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900,
    930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290,
    1320, 1350, 1380, 1410, 1440,
  ];

  useEffect(() => {
    setTimeEdit(schedule);
  }, [schedule]);

  useEffect(() => {
    // Verificar si hay alguna propiedad con open en 0 y close en 1440
    const hasOpen0Close1440 = Object.values(timeEdit).some(
      (service) => service.open === 0 && service.close === 1440
    );
    // Establecer el estado de pendingServices
    setRemaining(hasOpen0Close1440);
  }, [timeEdit]);

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setTimeEdit(schedule);
  };

  const handleSubmit = async () => {
    // Validar que open no sea mayor que close
    for (const key in timeEdit) {
      const { open, close } = timeEdit[key];
      if (open > close) {
        setShowAlert({
          isOpen: true,
          message:
            "La hora de apertura no puede ser mayor que la hora de cierre",
          type: "warning",
          button1: {
            text: "",
            action: "",
          },
          buttonClose: {
            text: "Entendido",
          },
        });
        return; // Detener el proceso si la validación falla
      }
    }

    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/schedule/update`, {
        newSchedule: timeEdit,
      });
      toastAlert("Cambios guardados exitosamente.", "success");
      setRefresh(!refresh);
    } catch (error) {
      toastAlert("Error al cambiar los horarios.", "error");
      console.error("Error al obtener los horarios", error);
    }
    setShowEdit(false);
  };
  const handleSelectChange = (event, index, type) => {
    const value = event.target.value;
    setTimeEdit((prevState) => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        [type]: value,
      },
    }));
  };
  return (
    <div style={{ position: "relative" }}>
      <hr
        style={{
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      {Object.keys(timeEdit).length > 0 &&
        days.map((day, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
              {timeEdit[index] ? day : "------"}
            </h3>
            {timeEdit[index] ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 style={{ color: "red" }}>
                  {timeEdit[index].open === 0 && timeEdit[index].close === 1440
                    ? "Pendiente"
                    : null}
                </h4>
                <Select
                  key={index + 20}
                  id="input-schedule-open"
                  style={{
                    height: "40px",
                    minWidth: "90px",
                    marginLeft: "5px",
                    color: "var(--text-color)", // Color del texto seleccionado
                    backgroundColor: "var(--bg-color-hover)",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.open ? timeEdit[index]?.open : 0}
                  onChange={(event) => handleSelectChange(event, index, "open")}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: "var(--bg-color-hover)", // Fondo del menú desplegable
                        color: "var(--text-color)", // Color del texto en el menú
                      },
                    },
                  }}
                >
                  {timeArray.map((minute, index) => (
                    <MenuItem
                      key={index}
                      value={minute}
                      style={{
                        fontFamily: "Jost, sans-serif",
                        fontWeight: "bold",
                        color: "var(--text-color)",
                      }}
                    >
                      {formatHour(minute)}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  key={index + 10}
                  id="input-schedule-close"
                  style={{
                    height: "40px",
                    minWidth: "90px",
                    marginLeft: "5px",
                    color: "var(--text-color)", // Color del texto seleccionado
                    backgroundColor: "var(--bg-color-hover)",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.close ? timeEdit[index]?.close : 1440}
                  onChange={(event) =>
                    handleSelectChange(event, index, "close")
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: "var(--bg-color-hover)", // Fondo del menú desplegable
                        color: "var(--text-color)", // Color del texto en el menú
                      },
                    },
                  }}
                >
                  {timeArray.map((minute, index) => (
                    <MenuItem
                      key={index + 100}
                      value={minute}
                      style={{
                        fontFamily: "Jost, sans-serif",
                        fontWeight: "bold",
                        color: "var(--text-color)",
                      }}
                    >
                      {formatHour(minute)}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ) : (
              <h4 style={{ color: "#2196f3", marginRight: "50px" }}>
                No laborable
              </h4>
            )}
          </div>
        ))}
      <Box sx={{ marginTop: "12px" }}>
        {showEdit === false && (
          <Button onClick={handleEdit}>
            <CreateRoundedIcon />
          </Button>
        )}
        {showEdit === true && (
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleCancel}
              sx={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
            >
              Descartar
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default OpeningAndClosing;
