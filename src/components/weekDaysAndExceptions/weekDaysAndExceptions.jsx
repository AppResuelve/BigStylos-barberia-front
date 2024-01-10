import { useEffect, useState } from "react";
import axios from "axios";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Button } from "@mui/material";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WeekDaysAndExceptions = () => {
  const [schedule, setSchedule] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(null);
  const [showRemove, setShowRemove] = useState(null);
  const [toggle, setToggle] = useState(null);
  const [timeEdit, setTimeEdit] = useState({});
  const [refresh, setRefresh] = useState(false);

  const days = [
    ["Lun", 0],
    ["Mar", 1],
    ["Mie", 2],
    ["Jue", 3],
    ["Vie", 4],
    ["Sab", 5],
    ["Dom", 6],
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule`);
        const { data } = response;
        console.log(data.businessSchedule, "pase por el useEffect");
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
    setShowAdd(null);
    setShowRemove(null);
    setToggle(null);
  };

  const handleShowAddRemove = (value) => {
    console.log(value);
    value === "add"
      ? (setShowAdd(true), setToggle(true), setShowRemove(false))
      : (setShowRemove(true), setToggle(false), setShowAdd(false));
  };

  const handleChange = (value, day) => {
    console.log("pase handle change");
    console.log(value, day);
    if (value === "add") {
      setTimeEdit((prevState) => ({
        ...prevState,
        [day]: {
          open: "",
          close: "",
        },
      }));
    } else {
      const updatedTimeEdit = { ...timeEdit };
      delete updatedTimeEdit[day];
      setTimeEdit(updatedTimeEdit);
    }
  };

  const handleSubmit = async () => {
    console.log(timeEdit, "pase por el submit");
    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/schedule/update`, {
        newSchedule: timeEdit,
      });
      console.log(response);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error al obtener los horarios", error);
      alert("Error al obtener los horarios");
    }
    setShowEdit(false);
    setToggle(1);
    setShowAdd(null);
    setShowRemove(null);
  };
  console.log(timeEdit);
  //averiguar como entrar en la propiedad dia en base al numero
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
        {Object.keys(schedule).length > 0 &&
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
                <h3>{timeEdit[index] ? day[0] : "--"}</h3>
                {showRemove && timeEdit[index] && (
                  <button
                    style={{
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => handleChange("remove", day[1])}
                  >
                    <DeleteOutlineIcon style={{ color: "red" }} />
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
                    onClick={() => handleChange("add", day[1])}
                  >
                    <AddIcon style={{ color: "#2196f3" }} />
                  </button>
                )}
              </Box>
            );
          })}
      </Box>
      <Box>
        {showEdit === false && (
          <Button onClick={handleEdit} style={{ marginBottom: "12px" }}>
            <BorderColorIcon />
          </Button>
        )}
        {showEdit === true && (
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <Button
              onClick={handleCancel}
              variant="outlined"
              style={{
                borderRadius: "50px",
                border: "2px solid",
                fontFamily: "Jost, sans-serif",
              }}
            >
              Cancelar
            </Button>
            <Box>
              <Button
                disabled={toggle === true ? true : false}
                onClick={() => handleShowAddRemove("add")}
              >
                <AddIcon />
              </Button>
              <Button
                style={{ color: "red" }}
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
      <hr
        style={{
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
    </div>
  );
};

export default WeekDaysAndExceptions;
