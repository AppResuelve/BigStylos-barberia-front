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
          // Verifica si el nuevo servicio no está vacío
          await axios.put(`${VITE_BACKEND_URL}/users/update`, {
            email: clientData.email,
            newPhoneNumber,
          });
          setShowAlertSnack({
            message: "El numero se ha actualizado",
            type: "success",
          });
          setOpen(true);
          // Refresca la lista de servicios después de agregar uno nuevo
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
        onClick={() => handleSectionClick("miperfil")}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "50px",
          borderRadius: "4px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <h3
            style={{
              fontFamily: "Jost,sans-serif",
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
        style={{
          border: "none",
          height: "1px", // Altura de la línea
          backgroundColor: darkMode.on ? "white" : darkMode.dark,
          marginBottom: "10px",
          marginTop: "10px",
        }}
      />
      <Collapse
        in={openSection.miperfil ? true : false}
        timeout="auto"
        unmountOnExit
      >
        {/* ////// contenido de seccion telefono dentro de miperfil ////// */}
        <ListItemButton
          onClick={() => handleSectionClick("telefono")}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
            borderRadius: "4px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <LocalPhoneIcon
              sx={{
                marginRight: "5px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            />
            <h3
              style={{
                fontFamily: "Jost,sans-serif",
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
          <List component="div" disablePadding>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                // alignItems: "center",
              }}
            >
              <Input
                id="input-telephone-myProfile"
                type="text"
                value={newPhoneNumber}
                placeholder="ej: 011493523"
                onChange={(e) => handleSetPhoneState(e.target.value)}
                onKeyDown={handleKeyDown} // Manejar el evento onKeyDown
                sx={{
                  paddingLeft: "10px",
                  fontFamily: "Jost, sans-serif",
                  fontSize: "20px",
                  width: "80%",
                  borderRadius: "5px",
                  color: !darkMode.on ? "white" : darkMode.dark,
                  bgcolor: darkMode.on ? "white" : darkMode.dark,
                }}
              />
              <Button
                variant="contained"
                color="success"
                sx={{ width: "20%" }}
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
        {/*////// contenido de seccion turnos dentro de miperfil //////*/}
        <ListItemButton
          onClick={() => handleSectionClick("turnos")}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
            borderRadius: "4px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <CalendarMonthIcon
              sx={{
                marginRight: "5px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            />
            <h3
              style={{
                fontFamily: "Jost,sans-serif",
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
            style={{
              border: "none",
              height: "1px", // Altura de la línea
              backgroundColor: darkMode.on ? "white" : darkMode.dark,
              marginBottom: "10px",
            }}
          />
        )}
      </Collapse>
    </div>
  );
};
export default ClientNestedList;

//  <Box sx={{ marginBottom: "10px" }}>
//    <h3>Mi perfil</h3>

//  </Box>;
