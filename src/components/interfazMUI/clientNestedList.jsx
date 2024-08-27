import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import ListItemButton from "@mui/material/ListItemButton";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Collapse, List } from "@mui/material";
import AlertSnackBar from "./alertSnackBar";
import MyTurns from "../myTurns/myTurns";
import InputTel from "../inputTel/inputTel";
import axios from "axios";
import "./clientNestedList.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ClientNestedList = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData } = useContext(AuthContext);
  const [newPhoneNumber, setNewPhoneNumber] = useState(userData?.phone ?? "");
  const [refresh, setRefresh] = useState(false);
  const [showAlertSnack, setShowAlertSnack] = useState({});
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState({
    miperfil: false,
    telefono: false,
    turnos: false,
  });
  const [inputTelError, setInputTelError] = useState("");

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

      return updatedSections;
    });
  };

  // const handleSetPhoneState = async (value) => {
  //   // Expresión regular que solo permite números, "+", "(", ")" y "-"
  //   const allowedCharacters = /^[0-9+()-]*$/;

  //   // Verificar si el valor cumple con la expresión regular y no excede los 20 caracteres
  //   if (allowedCharacters.test(value) && value.length < 8) {
  //     setNewPhoneNumber(value);

  //     // Actualizar el estado solo si el valor cumple con las validaciones
  //     setError("Debe ser mayor a 8 caracteres");
  //   } else if (allowedCharacters.test(value) && value.length <= 20) {
  //     setError("");
  //     setNewPhoneNumber(value);
  //   }
  // };

  const handleUpdatePhone = async () => {
    if (inputTelError !== "") {
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
            email: userData.email,
            newPhoneNumber,
          });
          setShowAlertSnack({
            message: "",
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
        sx={{
          borderBottom: darkMode.on
            ? `1px solid ${"white"} `
            : `1px solid ${darkMode.dark}`,
        }}
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

      <Collapse
        in={openSection.miperfil ? true : false}
        timeout="auto"
        unmountOnExit
      >
        {/* ////// contenido de seccion telefono dentro de miperfil ////// */}
        <ListItemButton
          className="listItembtn-nestedList"
          onClick={() => handleSectionClick("telefono")}
          sx={{
            borderBottom: darkMode.on
              ? `1px solid ${"white"} `
              : `1px solid ${darkMode.dark}`,
          }}
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
                className={
                  inputTelError
                    ? "my-button-disabled-upadatephone"
                    : "my-button-upadatephone"
                }
                disabled={inputTelError ? true : false}
                onClick={handleUpdatePhone}
              >
                <DoneOutlineIcon sx={{ color: "white" }} />
              </button>
            </div>
          </List>
        </Collapse>

        {/*////// contenido de seccion turnos dentro de miperfil //////*/}
        <ListItemButton
          className="listItembtn-nestedList"
          onClick={() => handleSectionClick("turnos")}
          sx={{
            borderBottom: darkMode.on
              ? `1px solid ${"white"} `
              : `1px solid ${darkMode.dark}`,
          }}
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
      </Collapse>
    </div>
  );
};
export default ClientNestedList;
