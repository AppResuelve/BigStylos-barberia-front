import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Button } from "@mui/material";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WorkDays = ({ schedule, refresh, setRefresh, setChangeNoSaved }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(null);
  const [showRemove, setShowRemove] = useState(null);
  const [toggle, setToggle] = useState(null);
  const [timeEdit, setTimeEdit] = useState({});

  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  useEffect(() => {
    setTimeEdit(schedule);
  }, [schedule]);
  const handleEdit = () => {
    setShowEdit(true);
  };
  const handleCancel = () => {
    setShowEdit(false);
    setTimeEdit(schedule);
    setShowAdd(null);
    setShowRemove(null);
    setToggle(null);
    setChangeNoSaved({});
  };

  const handleShowAddRemove = (value) => {
    value === "add"
      ? (setShowAdd(true), setToggle(true), setShowRemove(false))
      : (setShowRemove(true), setToggle(false), setShowAdd(false));
  };

  const handleChange = (value, index) => {
    setChangeNoSaved({ component: true });
    if (value === "add") {
      setTimeEdit((prevState) => ({
        ...prevState,
        [index]: {
          open: 0,
          close: 1440,
        },
      }));
    } else {
      if (Object.keys(timeEdit).length < 2) {
        return;
      }
      const updatedTimeEdit = { ...timeEdit };
      delete updatedTimeEdit[index];
      setTimeEdit(updatedTimeEdit);
    }
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
    setChangeNoSaved({});
    setToggle(1);
    setShowAdd(null);
    setShowRemove(null);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <hr
        style={{
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      <Box style={{ display: "flex", height: "70px", marginBottom: "12px" }}>
        {Object.keys(timeEdit).length > 0 &&
          days.map((day, index) => {
            return (
              <Box
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {timeEdit[index] ? (
                  <h3
                    style={{
                      color:
                        timeEdit[index] &&
                        timeEdit[index].open === 0 &&
                        timeEdit[index].close === 1440
                          ? "red"
                          : darkMode.on
                          ? "white"
                          : darkMode.dark,
                    }}
                  >
                    {day}
                  </h3>
                ) : (
                  <h3 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                    --
                  </h3>
                )}
                {showRemove && timeEdit[index] && (
                  <button
                    style={{
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => handleChange("remove", index)}
                  >
                    <DeleteOutlineIcon
                      style={{ color: darkMode.on ? "white" : darkMode.dark }}
                    />
                  </button>
                )}
                {showAdd && !timeEdit[index] && (
                  <button
                    style={{
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => handleChange("add", index)}
                  >
                    <AddIcon
                      style={{ color: darkMode.on ? "white" : darkMode.dark }}
                    />
                  </button>
                )}
              </Box>
            );
          })}
      </Box>
      <Box>
        {showEdit === false && (
          <Button onClick={handleEdit} style={{ marginBottom: "5px" }}>
            <BorderColorIcon />
          </Button>
        )}
        {showEdit === true && (
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "3px",
            }}
          >
            <Button
              onClick={handleCancel}
              variant="outlined"
              style={{
                borderRadius: "50px",
                border: "2px solid",
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
              }}
            >
              Volver
            </Button>
            <Box>
              <Button
                disabled={toggle === true ? true : false}
                onClick={() => handleShowAddRemove("add")}
              >
                <AddIcon />
              </Button>
              <Button
                color="error"
                disabled={toggle === false ? true : false}
                onClick={() => handleShowAddRemove("remove")}
              >
                <DeleteOutlineIcon />
              </Button>
            </Box>
            <Button onClick={handleSubmit} variant="contained">
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default WorkDays;
