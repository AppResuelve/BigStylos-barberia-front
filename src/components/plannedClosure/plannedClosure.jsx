import { useEffect, useState } from "react";
import CustomCalendarPlannedC from "../customCalendar/customCalendarPlannedC";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Button } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import toastAlert from "../../helpers/alertFunction";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PlannedClosure = ({ schedule }) => {
  //horarios de apertura y cierre sin los dias no laborables
  const [noWork, setNoWork] = useState({}); // dias con cierre programado
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [days, setDays] = useState({}); // dias para calendario
  const [loading, setLoading] = useState(true);

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

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setDayIsSelected({});
    setShowEdit(false);
  };

  const handleSubmit = async () => {
    let confirm = false;
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
          confirm = true;
          try {
            const response = await axios.put(
              `${VITE_BACKEND_URL}/schedule/updatenowork`,
              {
                noWorkDays: dayIsSelected,
              }
            );
            toastAlert("Día/s cerrado/s exitosamente.", "success");
            setRefresh(!refresh);
          } catch (error) {
            toastAlert("Error al cerrar el/los Día/s.", "error");
            console.error("Error al obtener los dias:", error);
          }
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
        toastAlert("Día/s cerrado/s exitosamente.", "success");
        setRefresh(!refresh);
      } catch (error) {
        toastAlert("Error al cerrar el/los Día/s.", "error");
        console.error("Error al obtener los dias:", error);
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
      />
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
              style={{ border: "2px solid" }}
            >
              <h4
                style={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
              >
                Volver
              </h4>
            </Button>
            <Button
              disabled={Object.keys(dayIsSelected).length > 0 ? false : true}
              color="error"
              onClick={handleSubmit}
              variant="contained"
            >
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>cerrar días</h4>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};
export default PlannedClosure;
