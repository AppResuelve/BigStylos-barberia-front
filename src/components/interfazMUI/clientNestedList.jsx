import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import ListItemButton from "@mui/material/ListItemButton";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Collapse, List } from "@mui/material";
import MyTurns from "../myTurns/myTurns";
import InputTel from "../inputTel/inputTel";
import Swal from "sweetalert2";
import axios from "axios";
import "./clientNestedList.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ClientNestedList = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData, openSection, setOpenSection } = useContext(AuthContext);
  const [newPhoneNumber, setNewPhoneNumber] = useState(userData?.phone ?? "");
  const [refresh, setRefresh] = useState(false);
  const [inputTelError, setInputTelError] = useState("");

  const handleSectionClick = (section) => {
    setOpenSection((prevSections) => {
      // Mantén una copia del objeto anterior
      const updatedSections = { ...prevSections };

      // Cambia el valor de la sección clicada al opuesto del valor actual
      updatedSections[section] = !prevSections[section];

      // Si la sección clicada es "telefono", establece "turnos" en false, y viceversa
      if (section === "telefono") {
        updatedSections.turnos = false;
      } else if (section === "turnos") {
        updatedSections.telefono = false;
      }

      return updatedSections;
    });
  };

  const handleUpdatePhone = async () => {
    try {
      if (newPhoneNumber !== "") {
        // Verifica si el nuevo telefono no está vacío
        await axios.put(`${VITE_BACKEND_URL}/users/update`, {
          email: userData.email,
          newPhoneNumber,
        });
        Swal.fire({
          title: "Telefono guardado exitosamente!",
          icon: "success",
          timer: 3000,
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          customClass: {
            container: "my-swal-container",
          },
        });
        setRefresh(!refresh);
      }
    } catch (error) {
      Swal.fire({
        title: "Error al cambiar el numero de teléfono.",
        icon: "error",
        timer: 3000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        customClass: {
          container: "my-swal-container",
        },
      });
      console.error("Error al cambiar el numero de teléfono:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* ////// contenido de seccion telefono dentro de miperfil ////// */}
      <ListItemButton
        className="listItembtn-nestedList"
        onClick={() => handleSectionClick("telefono")}
      >
        <Box sx={{ display: "flex", width: "100%" }}>
          <LocalPhoneIcon
            sx={{
              marginRight: "5px",
              color: darkMode.on ? "white" : darkMode.dark,
            }}
          />
          <span
            className="span-nestedList"
            style={{
              color: darkMode.on ? "white" : darkMode.dark,
            }}
          >
            Teléfono
          </span>
        </Box>
        {openSection.telefono ? (
          <ExpandLess sx={{ color: darkMode.on ? "white" : darkMode.dark }} />
        ) : (
          <ExpandMore sx={{ color: "#2196f3" }} />
        )}
      </ListItemButton>
      <Collapse
        in={openSection.telefono ? true : false}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding sx={{ marginBottom: "5px" }}>
          <div className="div-container-tel">
            <div>
              <InputTel
                newPhoneNumber={newPhoneNumber}
                setNewPhoneNumber={setNewPhoneNumber}
                inputTelError={inputTelError}
                setInputTelError={setInputTelError}
              />
              {inputTelError && (
                <span className="spanErrorInputTel">{inputTelError}</span>
              )}
            </div>
            <button
              className={"my-button-upadatephone"}
              disabled={inputTelError ? true : false}
              onClick={handleUpdatePhone}
            >
              Guardar
            </button>
          </div>
        </List>
      </Collapse>
      <hr
        className="hr-userModal"
        style={{
          backgroundColor: darkMode.on ? "white" : darkMode.dark,
        }}
      />
      {/*////// contenido de seccion turnos dentro de miperfil //////*/}
      <ListItemButton
        className="listItembtn-nestedList"
        onClick={() => handleSectionClick("turnos")}
      >
        <Box sx={{ display: "flex", width: "100%" }}>
          <CalendarMonthIcon
            sx={{
              marginRight: "5px",
              color: darkMode.on ? "white" : darkMode.dark,
            }}
          />
          <span
            className="span-nestedList"
            style={{
              color: darkMode.on ? "white" : darkMode.dark,
            }}
          >
            Mis turnos
          </span>
        </Box>
        {openSection.turnos ? (
          <ExpandLess sx={{ color: darkMode.on ? "white" : darkMode.dark }} />
        ) : (
          <ExpandMore sx={{ color: "#2196f3" }} />
        )}
      </ListItemButton>
      <Collapse
        in={openSection.turnos ? true : false}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding>
          <MyTurns userData={userData} />
        </List>
      </Collapse>
      <hr
        className="hr-userModal"
        style={{
          backgroundColor: darkMode.on ? "white" : darkMode.dark,
        }}
      />
    </div>
  );
};
export default ClientNestedList;
