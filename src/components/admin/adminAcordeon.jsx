import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
import { LoaderLinearProgress } from "../loaders/loaders";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminAcordeon = () => {
  const { darkMode } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [refreshServices, setRefreshServices] = useState(false);
  const [remaining, setRemaining] = useState(false);
  const [loading, setLoading] = useState({
    services: true,
    schedule: true,
  });
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [changeNoSaved, setChangeNoSaved] = useState({}); //estado para alertar cuando hay cambios sin guardar en cualquiera de los componentes
  const [services, setServices] = useState({});
  const [refreshWhoIsComing, setRefreshWhoIsComing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prevState) => ({ ...prevState, services: true })); // Empieza la carga de services
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services`);
        const { data } = response;
        setServices(data); // Setea los servicios obtenidos
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        setLoading((prevState) => ({ ...prevState, services: false }));
      }
      setLoading((prevState) => ({ ...prevState, services: false })); // Termina la carga de services
    };
    fetchData();
  }, [refreshServices]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prevState) => ({ ...prevState, schedule: true })); // Empieza la carga de schedule
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule`);
        const { data } = response;
        setSchedule(data.businessSchedule);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
        setLoading((prevState) => ({ ...prevState, schedule: false }));
      }
      setLoading((prevState) => ({ ...prevState, schedule: false }));
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
        reverseButtons: true,
        backdrop: `rgba(0,0,0,0.8)`,
        customClass: {
          container: "custom-swal-container",
          htmlContainer: "custom-swal-body",
          popup: "custom-swal-modal",
          actions: "swal2-actions",
          confirmButton: "custom-confirm-button",
          denyButton: "custom-deny-button",
          icon: "custom-icon-swal",
        },
      });
    } else {
      setExpanded(isExpanded ? panel : false);
    }
  };

  return (
    <div
      className="container-adminaccordion"
      style={{ paddingTop: sm ? "30px" : "70px" }}
    >
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          sx={{
            backgroundColor:
              expanded === "panel1"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel1"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <h2 style={{ color: "var(--text-color)" }}>Categorias y servicios</h2>
        </AccordionSummary>
        <AccordionDetails>
          {loading.services ? (
            <LoaderLinearProgress loadingServices={loading.services} />
          ) : (
            <Services
              services={services}
              refreshServices={refreshServices}
              setRefreshServices={setRefreshServices}
            />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          sx={{
            backgroundColor:
              expanded === "panel2"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel2"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <h2 style={{ color: "var(--text-color)" }}>Dias laborales</h2>
        </AccordionSummary>
        <AccordionDetails>
          {loading.schedule ? (
            <LoaderLinearProgress loadingServices={loading.schedule} />
          ) : (
            <WorkDays
              schedule={schedule}
              setSchedule={setSchedule}
              refresh={refresh}
              setRefresh={setRefresh}
              setChangeNoSaved={setChangeNoSaved}
            />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          sx={{
            backgroundColor:
              expanded === "panel3"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel3"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
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
            <h2 style={{ color: "var(--text-color)" }}>Apertura y cierre</h2>
            {remaining && (
              <span className="span-administration">(Pendiente)</span>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {loading.schedule ? (
            <LoaderLinearProgress loadingServices={loading.schedule} />
          ) : (
            <OpeningAndClosing
              schedule={schedule}
              setSchedule={setSchedule}
              refresh={refresh}
              setRefresh={setRefresh}
              setRemaining={setRemaining}
            />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          sx={{
            backgroundColor:
              expanded === "panel4"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel4"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <h2 style={{ color: "var(--text-color)" }}>Cierre programado</h2>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          {loading.schedule ? (
            <LoaderLinearProgress loadingServices={loading.schedule} />
          ) : (
            <PlannedClosure
              schedule={schedule}
              setSchedule={setSchedule}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary
          sx={{
            backgroundColor:
              expanded === "panel5"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel5"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
          <h2 style={{ color: "var(--text-color)" }}>Usuarios</h2>
        </AccordionSummary>
        <AccordionDetails>
          <Users
            refreshWhoIsComing={refreshWhoIsComing}
            setRefreshWhoIsComing={setRefreshWhoIsComing}
          />
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel6"}
        onChange={handleChange("panel6")}
      >
        <AccordionSummary
          sx={{
            backgroundColor:
              expanded === "panel6"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel6"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="panel6bh-content"
          id="panel6bh-header"
        >
          <h2 style={{ color: "var(--text-color)" }}>Personalización</h2>
        </AccordionSummary>
        <AccordionDetails>
          {loading.services ? (
            <LoaderLinearProgress loadingServices={loading.services} />
          ) : (
            <Personalization
              services={services}
              refreshServices={refreshServices}
              setRefreshServices={setRefreshServices}
              changeNoSaved={changeNoSaved}
              setChangeNoSaved={setChangeNoSaved}
            />
          )}
        </AccordionDetails>
      </Accordion>
      {/* ********************************************************************************************************* */}
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel7"}
        onChange={handleChange("panel7")}
      >
        <AccordionSummary
          sx={{
            display: "flex",
            backgroundColor:
              expanded === "panel7"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel7"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="panel7bh-content"
          id="panel7bh-header"
        >
          <h2 style={{ color: "var(--text-color)" }}>Agenda de turnos</h2>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <WhoIsComingAdmin refreshWhoIsComing={refreshWhoIsComing} />
        </AccordionDetails>
      </Accordion>
      {/********************************************************************************************************** */}
      <Accordion
        className="container-accordion"
        expanded={expanded === "panel8"}
        onChange={handleChange("panel8")}
      >
        <AccordionSummary
          sx={{
            backgroundColor:
              expanded === "panel8"
                ? "var(--bg-color-hover)"
                : "var(--bg-color-secondary)",
            borderRadius: "15px",
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color:
                  expanded === "panel8"
                    ? "var(--text-color)"
                    : "var(--accent-color)",
              }}
            />
          }
          aria-controls="panel8bh-content"
          id="panel8bh-header"
        >
          <h2 style={{ color: "var(--text-color)" }}>Turnos cancelados</h2>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <CancelledTurnsForAdmin refreshWhoIsComing={refreshWhoIsComing} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default AdminAcordeon;
