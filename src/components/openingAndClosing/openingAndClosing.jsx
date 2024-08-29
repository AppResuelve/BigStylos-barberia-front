import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import formatHour from "../../functions/formatHour";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Button, MenuItem, Select } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

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
      Swal.fire({
        title: "Cambios guardados exitosamente.",
        icon: "success",
        timer: 3000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        showCloseButton: true,
      });
      setRefresh(!refresh);
    } catch (error) {
       Swal.fire({
         title: "Error al cambiar los horarios.",
         icon: "error",
         timer: 3000,
         toast: true,
         position: "bottom-end",
         showConfirmButton: false,
         showCloseButton: true,
       });
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
                    backgroundColor: darkMode.on ? "white" : "#d6d6d5",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.open ? timeEdit[index]?.open : 0}
                  onChange={(event) => handleSelectChange(event, index, "open")}
                >
                  {timeArray.map((minute, index) => (
                    <MenuItem
                      key={index}
                      value={minute}
                      style={{
                        fontFamily: "Jost, sans-serif",
                        fontWeight: "bold",
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
                    backgroundColor: darkMode.on ? "white" : "#d6d6d5",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.close ? timeEdit[index]?.close : 1440}
                  onChange={(event) =>
                    handleSelectChange(event, index, "close")
                  }
                >
                  {timeArray.map((minute, index) => (
                    <MenuItem
                      key={index + 100}
                      value={minute}
                      style={{
                        fontFamily: "Jost, sans-serif",
                        fontWeight: "bold",
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
            <BorderColorIcon />
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
              variant="outlined"
              style={{ borderRadius: "50px", border: "2px solid " }}
            >
              <h4
                style={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
              >
                Volver
              </h4>
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
