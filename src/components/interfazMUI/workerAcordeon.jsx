import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Services from "../services/services";
import PublicAttention from "../opening&Closing/opening&Closing";
import Users from "../users/users";
import bgImgLocal from "../../assets/bg-img-local.png";
import { Box } from "@mui/material";

const AdminWorkerAcordeonModal = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "70px",
        width: "90vw",
        maxWidth: "900px",
      }}
    >
      <Box style={{ position: "relative" }}>
        <img
          src={bgImgLocal}
          style={{
            width: "350px",
            position: "absolute",
            top: "30vh",
            left: "10vw",
          }}
        />
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h2>Servicios</h2>
          </AccordionSummary>
          <AccordionDetails>
            <Services />
          </AccordionDetails>
        </Accordion>
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <h2>Apertura y cierre</h2>
          </AccordionSummary>
          <AccordionDetails>
            <PublicAttention />
          </AccordionDetails>
        </Accordion>
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <h2>Usuarios</h2>
          </AccordionSummary>
          <AccordionDetails>
            <Users />
          </AccordionDetails>
        </Accordion>
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <h2 sx={{ width: "33%", flexShrink: 0 }}>Otro</h2>
          </AccordionSummary>
          <AccordionDetails>///////</AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
};
export default AdminWorkerAcordeonModal;
