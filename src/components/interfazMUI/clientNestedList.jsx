import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Button, Input } from "@mui/material";
import axios from "axios";
import AlertSnackBar from "./alertSnackBar";
import MyTurns from "../myTurns/myTurns";
import "./clientNestedList.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ClientNestedList = ({ userData }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [clientData, setClientData] = useState(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [showAlertSnack, setShowAlertSnack] = useState({});
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState({
    miperfil: false,
    telefono: false,
    turnos: false,
  });
console.log(error);
  const handleSectionClick = (section) => {
    setOpenSection((prevSections) => {
      // Si la sección clicada es "miperfil", establece todas las demás secciones en false
      if (section === "miperfil") {
        return {
          miperfil: !prevSections.miperfil,
          telefono: false,
          turnos: false,
        };
      }
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
      setNewPhoneNumber(currentPhoneNumber);
      return updatedSections;
    });
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.post(`${VITE_BACKEND_URL}/users/byemail`, {
          email: userData.email,
        });
        const { data } = response;
        setClientData(data);
        setCurrentPhoneNumber(data.phone);
        handleSetPhoneState(data.phone);
        //   setLoading(false);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchClientData();
  }, [refresh]);

  const handleKeyDown = (e) => {
    // Manejar el evento cuando se presiona Enter
    if (e.keyCode === 13) {
      e.preventDefault(); // Evitar que se agregue un salto de línea en el Input
      handleUpdatePhone();
    }
  };

  const handleSetPhoneState = async (value) => {
    // Expresión regular que solo permite números, "+", "(", ")" y "-"
    const allowedCharacters = /^[0-9+()-]*$/;

    // Verificar si el valor cumple con la expresión regular y no excede los 20 caracteres
    if (allowedCharacters.test(value) && value.length < 10) {
      setNewPhoneNumber(value);

      // Actualizar el estado solo si el valor cumple con las validaciones
      setError("Debe ser mayor a 10 caracteres");
    } else if (allowedCharacters.test(value) && value.length <= 20) {
      setError("");
      setNewPhoneNumber(value);
    }
  };

  const handleUpdatePhone = async () => {
    if (error !== "") {
      setShowAlertSnack({
        message: error,
        type: "error",
      });
      setOpen(true);
    } else {
      try {
        if (newPhoneNumber !== "") {
          // Verifica si el nuevo telefono no está vacío
          await axios.put(`${VITE_BACKEND_URL}/users/update`, {
            email: clientData.email,
            newPhoneNumber,
          });
          setShowAlertSnack({
            message: "El numero se ha actualizado",
            type: "success",
          });
          setOpen(true);
          setRefresh(!refresh);
        }
      } catch (error) {
        console.error("Error al cambiar el numero de teléfono:", error);
        alert("Error al cambiar el numero de teléfono");
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <AlertSnackBar
        showAlertSnack={showAlertSnack}
        setShowAlertSnack={setShowAlertSnack}
        open={open}
        setOpen={setOpen}
      />
      <ListItemButton
        className="listItembtn-nestedList"
        onClick={() => handleSectionClick("miperfil")}
      >
        <Box sx={{ width: "100%" }}>
          <h3
            className="h3-nestedList"
            style={{
              color: darkMode.on ? "white" : darkMode.dark,
            }}
          >
            Mi perfil
          </h3>
        </Box>
        {openSection.miperfil ? (
          <ExpandLess sx={{ color: darkMode.on ? "white" : darkMode.dark }} />
        ) : (
          <ExpandMore sx={{ color: "#2196f3" }} />
        )}
      </ListItemButton>
      <hr
        className="hr-nestedList"
        style={{
          backgroundColor: darkMode.on ? "white" : darkMode.dark,
        }}
      />
      <Collapse
        in={openSection.miperfil ? true : false}
        timeout="auto"
        unmountOnExit
      >
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
            <h3
              className="h3-nestedList"
              style={{
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            >
              Mis turnos
            </h3>
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
        {!openSection.turnos && (
          <hr
            className="hr-nestedList"
            style={{
              backgroundColor: darkMode.on ? "white" : darkMode.dark,
            }}
          />
        )}
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
            <h3
              className="h3-nestedList"
              style={{
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            >
              Teléfono
            </h3>
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
          <List component="div" disablePadding sx={{ marginBottom: "10px" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
              }}
            >
              <Input
                className="input-tel-nestedList"
                id="input-telephone-myProfile"
                type="tel"
                value={newPhoneNumber}
                placeholder="ej: 01149352 ..."
                onChange={(e) => handleSetPhoneState(e.target.value)}
                onKeyDown={handleKeyDown} // Manejar el evento onKeyDown
                sx={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                  fontSize: "15px",
                  bgcolor: darkMode.on ? "white" : "#d6d6d5",
                }}
              />
              <Button
                className="btn-update-turn-nestedList"
                variant="contained"
                color="success"
                onClick={handleUpdatePhone}
              >
                <DoneOutlineIcon sx={{ color: "white" }} />
              </Button>
            </Box>
          </List>
        </Collapse>
        {!openSection.telefono && (
          <hr
            style={{
              border: "none",
              height: "1px", // Altura de la línea
              backgroundColor: darkMode.on ? "white" : darkMode.dark,
              marginBottom: "10px",
              // marginTop: "10px",
            }}
          />
        )}
      </Collapse>
    </div>
  );
};
export default ClientNestedList;
