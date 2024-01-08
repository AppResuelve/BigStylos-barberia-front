import { useEffect, useState } from "react";
import axios from "axios";
import formatHour from "../../functions/formatHour";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, MenuItem, Select } from "@mui/material";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OpeningAndClosing = () => {
  const [schedule, setSchedule] = useState({});
  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  const [showEdit, setShowEdit] = useState(false);
  const timeArray = [
    0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450,
    480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900,
    930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290,
    1320, 1350, 1380, 1410, 1440,
  ];
  const [timeEdit, setTimeEdit] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule/`);
        const { data } = response;
        setSchedule(data.businessSchedule);
        setTimeEdit(data.businessSchedule);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchData();
  }, [refresh]);

  const handleEdit = () => {
    setShowEdit(true);
  };
  const handleCancel = () => {
    setShowEdit(false);
    setTimeEdit(schedule);
  };
  const handleSubmit = async () => {
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
    <div>
      {Object.keys(schedule).length > 0 &&
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
            <h3>{day}</h3>
            {schedule[index] && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Select
                  style={{ height: "40px" }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.open}
                  onChange={(event) => handleSelectChange(event, index, "open")}
                >
                  {timeArray.map((minute, index) => (
                    <MenuItem key={index} value={minute}>
                      {formatHour(minute)}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  style={{ height: "40px", width: "" }}
                  disabled={showEdit ? false : true}
                  value={timeEdit[index]?.close}
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
    </div>
  );
};

export default OpeningAndClosing;

//  <Box style={{ display: "flex" }}>
//    <Button onClick={handleCancel}>
//      <AddIcon />
//    </Button>
//    <hr />
//    <Button onClick={handleSubmit}>
//      <RemoveIcon />
//    </Button>
//  </Box>;
