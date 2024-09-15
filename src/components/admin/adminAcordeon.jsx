import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  LinearProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Services from "../services/services";
import WorkDays from "../workDays/workDays";
import OpeningAndClosing from "../openingAndClosing/openingAndClosing";
import PlannedClosure from "../plannedClosure/plannedClosure";
import Users from "../users/users";
import Personalization from "../personalization/personalization";
import WhoIsComingAdmin from "../whoIsComingAdmin/whoIsComingAdmin";
import CancelledTurnsForAdmin from "../cancelledTurnsForAdmin/cancelledTurnsForAdmin";
import Swal from "sweetalert2";
import "./admin.css";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminAcordeon = () => {
  const { darkMode } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [refreshServices, setRefreshServices] = useState(false);
  const [remaining, setRemaining] = useState(false);
  const [loading, setLoading] = useState(true);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [changeNoSaved, setChangeNoSaved] = useState({}); //estado para alertar cuando hay cambios sin guardar en cualquiera de los componentes
  const [services, setServices] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services`);
        const { data } = response;
        setServices(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };
    fetchData();
  }, [refreshServices]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule`);
        const { data } = response;
        setSchedule(data.businessSchedule);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchData();
  }, [refresh]);

  useEffect(() => {
    let aux = false;
    for (const index in schedule) {
      const { open, close } = schedule[index];
      if (open === 0 && close === 1440) {
        aux = true;
      } else {
        aux = false;
      }
      setRemaining(aux);
    }
  }, [schedule]);

  const panelNames = {
    panel1: "Categorías y servicios",
    panel2: "Días laborales",
    panel3: "Apertura y cierre",
    panel4: "Cierre programado",
    panel5: "Usuarios",
    panel6: "Personalización",
    panel7: "Agenda de turnos",
    panel8: "Turnos cancelados",
  };

  const handleChange = (panel) => (event, isExpanded) => {
    const panelName = panelNames[expanded];
    if (Object.keys(changeNoSaved).length > 0) {
      Swal.fire({
        title: `Tienes cambios sin guardar en la sección ${panelName}.`,
        icon: "warning",
        timer: 3000,
        showConfirmButton: true,
      });
    } else {
      setExpanded(isExpanded ? panel : false);
    }
  };

  return (
    <div
      className="container-adminacordeon"
      style={{ paddingTop: sm ? "30px" : "70px" }}
    >
      <Accordion
        style={{
          borderRadius: "0px 0px 5px 5px",
          marginBottom: "5px",
          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
        }}
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: expanded === "panel1" ? "#d6d6d5" : "",
            borderRadius: "2px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel1" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <h2
            style={{
              color: !darkMode.on
                ? darkMode.dark
                : expanded === "panel1"
                ? darkMode.dark
                : "white",
            }}
          >
            Categorias y servicios
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <Services
            services={services}
            refreshServices={refreshServices}
            setRefreshServices={setRefreshServices}
            // loadingServices={loadingServices}
            // setLoadingServices={setLoadingServices}
          />
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        style={{
          marginBottom: "5px",
          borderRadius: "0px 0px 5px 5px",
          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
        }}
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: expanded === "panel2" ? "#d6d6d5" : "",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel2" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <h2
            style={{
              color: !darkMode.on
                ? darkMode.dark
                : expanded === "panel2"
                ? darkMode.dark
                : "white",
            }}
          >
            Dias laborales
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(schedule).length > 0 && !loading ? (
            <WorkDays
              schedule={schedule}
              setSchedule={setSchedule}
              refresh={refresh}
              setRefresh={setRefresh}
              setChangeNoSaved={setChangeNoSaved}
            />
          ) : (
            <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        style={{
          marginBottom: "5px",
          borderRadius: "0px 0px 5px 5px",
          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
        }}
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: expanded === "panel3" ? "#d6d6d5" : "",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel3" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h2
              style={{
                color: !darkMode.on
                  ? darkMode.dark
                  : expanded === "panel3"
                  ? darkMode.dark
                  : "white",
              }}
            >
              Apertura y cierre
            </h2>
            {remaining && <span className="span-administration">(Pendiente)</span>}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(schedule).length > 0 && !loading ? (
            <OpeningAndClosing
              schedule={schedule}
              setSchedule={setSchedule}
              refresh={refresh}
              setRefresh={setRefresh}
              setRemaining={setRemaining}
            />
          ) : (
            <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        style={{
          marginBottom: "5px",
          borderRadius: "0px 0px 5px 5px",
          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
        }}
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: expanded === "panel4" ? "#d6d6d5" : "",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel4" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <h2
            style={{
              color: !darkMode.on
                ? darkMode.dark
                : expanded === "panel4"
                ? darkMode.dark
                : "white",
            }}
          >
            Cierre programado
          </h2>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          {Object.keys(schedule).length > 0 && !loading ? (
            <PlannedClosure
              schedule={schedule}
              setSchedule={setSchedule}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          ) : (
            <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        style={{
          marginBottom: "5px",
          borderRadius: "0px 0px 5px 5px",
          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
        }}
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: expanded === "panel5" ? "#d6d6d5" : "",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel5" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
          <h2
            style={{
              color: !darkMode.on
                ? darkMode.dark
                : expanded === "panel5"
                ? darkMode.dark
                : "white",
            }}
          >
            Usuarios
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <Users />
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        style={{
          marginBottom: "5px",
          borderRadius: "0px 0px 5px 5px",

          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
        }}
        expanded={expanded === "panel6"}
        onChange={handleChange("panel6")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: expanded === "panel6" ? "#d6d6d5" : "",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel6" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel6bh-content"
          id="panel6bh-header"
        >
          <h2
            style={{
              color: !darkMode.on
                ? darkMode.dark
                : expanded === "panel6"
                ? darkMode.dark
                : "white",
            }}
          >
            Personalización
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <Personalization
            services={services}
            refreshServices={refreshServices}
            setRefreshServices={setRefreshServices}
            changeNoSaved={changeNoSaved}
            setChangeNoSaved={setChangeNoSaved}
          />
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        style={{
          borderRadius: "0px 0px 5px 5px",
          marginBottom: "5px",
          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
        }}
        expanded={expanded === "panel7"}
        onChange={handleChange("panel7")}
      >
        <AccordionSummary
          sx={{
            display: "flex",
            backgroundColor: expanded === "panel7" ? "#d6d6d5" : "",
            borderRadius: "2px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel7" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel7bh-content"
          id="panel7bh-header"
        >
          <h2
            style={{
              color: !darkMode.on
                ? darkMode.dark
                : expanded === "panel7"
                ? darkMode.dark
                : "white",
            }}
          >
            Agenda de turnos
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <WhoIsComingAdmin />
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        style={{
          borderRadius: "0px 0px 5px 5px",
          marginBottom: "5px",
          boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,

          border: "none",
        }}
        expanded={expanded === "panel8"}
        onChange={handleChange("panel8")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: expanded === "panel8" ? "#d6d6d5" : "",
            borderRadius: "2px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: expanded === "panel8" ? "" : "#2196f3" }}
            />
          }
          aria-controls="panel8bh-content"
          id="panel8bh-header"
        >
          <h2
            style={{
              color: !darkMode.on
                ? darkMode.dark
                : expanded === "panel8"
                ? darkMode.dark
                : "white",
            }}
          >
            Turnos cancelados
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <CancelledTurnsForAdmin />
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
    </div>
  );
};
export default AdminAcordeon;
