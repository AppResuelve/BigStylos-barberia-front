import { useEffect, useState } from "react";
import CustomCalendarPlannedC from "../customCalendar/customCalendarPlannedC";
import { Box, Button } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import toastAlert from "../../helpers/alertFunction";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PlannedClosure = ({ schedule }) => {
  const [noWork, setNoWork] = useState({}); // dias con cierre programado
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [days, setDays] = useState({}); // dias para calendario
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState({
    add: false,
    remove: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/workdays`);
        const { data } = response;
        setDays(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule/`);
        const { data } = response;
        setNoWork(data.noWorkDays);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchData();
  }, [refresh]);

  const handleCancel = () => {
    setDayIsSelected({});
    setShowEdit(false);
    setToggle({
      add: false,
      remove: false,
    });
  };

  const handleToggle = (action) => {
    if (action === "add") {
      setShowEdit(true);
      setToggle({
        add: true,
        remove: false,
      });
    } else if (action === "add-discard") {
      setToggle({
        add: false,
        remove: false,
      });
      setShowEdit(false);
    } else if (action === "remove") {
      setShowEdit(true);
      setToggle({
        add: false,
        remove: true,
      });
    } else {
      setToggle({
        add: false,
        remove: false,
      });
      setShowEdit(false);
    }
    setDayIsSelected({});
  };

  const handleSubmit = async () => {
    let day = Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]]);
    let month = Object.keys(dayIsSelected)[0];
    if (days[month] && days[month][day] && days[month][day].turn) {
      Swal.fire({
        title: `Estas por cancelar los turnos del día ${day}/${month}, deseas continuar?`,
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Sí, cancelar",
        denyButtonText: "Más tarde",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.put(
              `${VITE_BACKEND_URL}/schedule/updatenowork&cancelturn`,
              {
                noWorkDaysCancelTurn: dayIsSelected,
              }
            );
            toastAlert("Día deshabilitado exitosamente.", "success");
            handleCancel();
            setRefresh(!refresh);
          } catch (error) {
            toastAlert("Error al deshabilitar el Día.", "error");
            console.error("Error al deshabilitar el Día.", error);
          }
        } else {
          return;
        }
      });
    } else {
      try {
        const response = await axios.put(
          `${VITE_BACKEND_URL}/schedule/updatenowork`,
          {
            noWorkDays: dayIsSelected,
          }
        );
        toastAlert(
          toggle.add
            ? "Día/s deshabilitado/s exitosamente."
            : "Día/s habilitado/s exitosamente.",
          "success"
        );
        handleCancel();
        setRefresh(!refresh);
      } catch (error) {
        toastAlert(
          toggle.add
            ? "Error al deshabilitar el/los Día/s."
            : "Error al habilitar el/los Día/s.",
          "error"
        );
        console.error("Error al habilitar el/los Día/s.", error);
      }
    }
  };

  return (
    <div>
      <hr
        style={{
          width: "100%",
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      <CustomCalendarPlannedC
        schedule={schedule}
        noWork={noWork}
        amountOfDays={27}
        dayIsSelected={dayIsSelected}
        setDayIsSelected={setDayIsSelected}
        days={days}
        showEdit={showEdit}
        toggle={toggle}
      />
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
                // variant="outlined"
                style={{
                  color: "#ff4800eb",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  // border: "2px solid",
                  // padding:"4px"
                }}
                onClick={() => handleToggle("remove-discard")}
              >
                Descartar
              </Button>
            ) : (
              <Button color="error" onClick={() => handleToggle("remove")}>
                <DeleteOutlineIcon
                  sx={{
                    color: "#ff4800eb",
                  }}
                />
              </Button>
            )}
          </div>
          <Button
            disabled={Object.keys(dayIsSelected).length > 0 ? false : true}
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
export default PlannedClosure;
