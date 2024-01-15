import { useEffect, useState } from "react";
import axios from "axios";
import formatHour from "../../functions/formatHour";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Button, MenuItem, Select } from "@mui/material";
import AlertModal from "../interfazMUI/alertModal";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OpeningAndClosing = ({ schedule, setSchedule, refresh, setRefresh }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showAlert, setShowAlert] = useState({});
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
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error al obtener los horarios", error);
      alert("Error al obtener los horarios");
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
            <h3>{timeEdit[index] ? day : "------"}</h3>
            {timeEdit[index] ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 style={{ color: "red" }}>
                  {timeEdit[index].open === 0 && timeEdit[index].close === 1440
                    ? "Pendiente"
                    : null}
                </h4>
                <Select
                  style={{ height: "40px", marginLeft: "5px" }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.open ? timeEdit[index]?.open : 0}
                  onChange={(event) => handleSelectChange(event, index, "open")}
                >
                  {timeArray.map((minute, index) => (
                    <MenuItem key={index} value={minute}>
                      {formatHour(minute)}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  style={{ height: "40px", marginLeft: "5px" }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.close ? timeEdit[index]?.close : 1440}
                  onChange={(event) =>
                    handleSelectChange(event, index, "close")
                  }
                >
                  {timeArray.map((minute, index) => (
                    <MenuItem key={index + 100} value={minute}>
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
      <Box>
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
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Volver</h4>
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
            </Button>
          </Box>
        )}
      </Box>
      <AlertModal showAlert={showAlert} setShowAlert={setShowAlert} />
    </div>
  );
};

export default OpeningAndClosing;
