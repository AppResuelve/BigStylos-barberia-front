import { useEffect, useState } from "react";
import CustomCalendarPlannedC from "../customCalendar/customCalendarPlannedC";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Button } from "@mui/material";
import AlertModal from "../interfazMUI/alertModal";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PlannedClosure = ({ schedule }) => {
  const [noWork, setNoWork] = useState({});
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [showAlert, setShowAlert] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [days, setDays] = useState({});
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
        const response = await axios.get(
          `${VITE_BACKEND_URL}/schedule/`
        );
        const { data } = response;
        console.log(data);
        setNoWork(data.noWorkDays);
        setDayIsSelected(data.noWorkDays);
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
    setShowEdit(false);
    setDayIsSelected(noWork);
  };

  const handleSubmit = async (confirm) => {
    //     if (confirm === "confirm") {
    //       console.log("hago peticion put con daysturn");
    //       try {
    //         const response = await axios.put(
    //           `${VITE_BACKEND_URL}/schedule/updatenowork`,
    //           {
    //             noWorkDays: dayIsSelected,
    //           }
    //         );
    //         const { data } = response;
    //         setRefresh(!refresh);
    //       } catch (error) {
    //         console.error("Error al obtener los dias:", error);
    //         alert("Error al obtener los dias");
    //       }
    //     } else if (daysWithTurns) {
    //       console.log("pase por el true del daysWithTurns, muestro la alerta");
    //       setShowAlert({
    //         isOpen: true,
    //         message:
    //           "Has seleccionado días con turnos reservados, deseas continuar?",
    //         type: "warning",
    //         button1: {
    //           text: "Si",
    //           action: "handleActionProp",
    //         },
    //         buttonClose: {
    //           text: "Volver",
    //         },
    //       });
    //     } else {
    try {
      console.log("hice el put con dias sin turno");
      const response = await axios.put(
        `${VITE_BACKEND_URL}/schedule/updateNoWork`,
        {
          noWorkDays: dayIsSelected,
        }
      );
      const { data } = response;
      setShowEdit(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error al obtener los dias:", error);
      alert("Error al obtener los dias");
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
        setDaysWithTurns={setDaysWithTurns}
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
      <AlertModal
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        handleActionProp={handleSubmit}
      />
    </div>
  );
};
export default PlannedClosure;
