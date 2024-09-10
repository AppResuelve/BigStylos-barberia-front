import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import AddIcon from "@mui/icons-material/Add";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { Box, Button } from "@mui/material";
import axios from "axios";
import toastAlert from "../../helpers/alertFunction";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WorkDays = ({ schedule, refresh, setRefresh, setChangeNoSaved }) => {
  const { darkMode } = useContext(ThemeContext);

  const [toggle, setToggle] = useState({
    add: false,
    remove: false,
  });
  const [timeEdit, setTimeEdit] = useState({});

  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  useEffect(() => {
    setTimeEdit(schedule);
  }, [schedule]);

  const handleToggle = (action) => {
    if (action === "add") {
      setToggle({
        add: true,
        remove: false,
      });
    } else if (action === "remove") {
      setToggle({
        add: false,
        remove: true,
      });
    } else {
      setToggle({
        add: false,
        remove: false,
      });
    }
    setChangeNoSaved({});
    setTimeEdit(schedule);
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
    toastAlert("Cambios guardados exitosamente.", "success");
    setChangeNoSaved({});
    setToggle({ add: false, remove: false });
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
                {toggle.remove && timeEdit[index] && (
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
                    <DeleteRoundedIcon style={{ color: "#ff4800eb" }} />
                  </button>
                )}
                {toggle.add && !timeEdit[index] && (
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
                    <AddIcon color="info" />
                  </button>
                )}
              </Box>
            );
          })}
      </Box>
      <Box sx={{ marginTop: "12px" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            {toggle.add ? (
              <Button
                style={{
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
                onClick={() => handleToggle("add-discard")}
              >
                Descartar
              </Button>
            ) : (
              <Button
                // variant={toggle.add ? "outlined" : "contained"}
                onClick={() => handleToggle("add")}
              >
                <AddIcon />
              </Button>
            )}
            <hr
              style={{
                border: "2px solid",
                borderRadius: "10px",
                margin: "0px 6px",
                color: "lightgray",
              }}
            />

            {toggle.remove ? (
              <Button
                color="error"
                style={{
                  color: "#ff4800eb",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
                onClick={() => handleToggle("remove-discard")}
              >
                Descartar
              </Button>
            ) : (
              <Button color="error" onClick={() => handleToggle("remove")}>
                <DeleteRoundedIcon
                  sx={{
                    color: "#ff4800eb",
                  }}
                />
              </Button>
            )}
          </div>
          <Button
            // disabled={Object.keys(dayIsSelected).length > 0 ? false : true}
            onClick={handleSubmit}
            variant="contained"
            style={{
              fontFamily: "Jost",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default WorkDays;
