import { useEffect, useState } from "react";
import CustomCalendarPlannedC from "../customCalendar/customCalendarPlannedC";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Button } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PlannedClosure = ({ schedule }) => { //horarios de apertura y cierre sin los dias no laborables
  const [noWork, setNoWork] = useState({}); // dias con cierre programado
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [showAlert, setShowAlert] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [days, setDays] = useState({});  // dias para calendario
  const [daysWithTurns, setDaysWithTurns] = useState({});
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
    if (turn) {
      Swal.fire({
        title: "",
        showDenyButton: true,
        confirmButtonText: "Ir a mis servicios",
        denyButtonText: `Más tarde`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.put(
              `${VITE_BACKEND_URL}/schedule/updatenowork`,
              {
                noWorkDays: dayIsSelected,
                daysToCancel: daysWithTurns,
              }
            );
            const { data } = response;
            setRefresh(!refresh);
          } catch (error) {
            console.error("Error al obtener los dias:", error);
            alert("Error al obtener los dias");
          }
        }
      });
    } else {
      try {
        const response = await axios.put(
          `${VITE_BACKEND_URL}/schedule/updatenowork`,
          {
            noWorkDays: dayIsSelected,
            daysToCancel: daysWithTurns,
          }
        );
        const { data } = response;
        setRefresh(!refresh);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
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
              style={{ borderRadius: "50px", border: "2px solid" }}
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
export default PlannedClosure;