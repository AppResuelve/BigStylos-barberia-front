import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Button, Input } from "@mui/material";
import axios from "axios";
import AlertSnackBar from "./alertSnackBar";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ClientNestedList = ({ userData }) => {
  const [openSection, setOpenSection] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [showAlertSnack, setShowAlertSnack] = useState({});
  const [open, setOpen] = useState(false);

  const handleSectionClick = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.post(`${VITE_BACKEND_URL}/users/byemail`, {
          email: userData.email,
        });
        const { data } = response;
        setClientData(data);
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
  console.log(error);
  console.log(newPhoneNumber);

  const handleSetPhoneState = async (value) => {
    // Expresión regular que solo permite números, "+", "(", ")" y "-"
    const allowedCharacters = /^[0-9+()-]*$/;

    // Verificar si el valor cumple con la expresión regular y no excede los 20 caracteres
    if (value.length < 10) {
      setNewPhoneNumber(value);

      // Actualizar el estado solo si el valor cumple con las validaciones
      setError("Debe ser mayor a 10 caracteres");
    } else if (allowedCharacters.test(value) && value.length <= 20) {
      setNewPhoneNumber(value);
    }
  };

  const handleUpdatePhone = async () => {
    if (error !== "") {
      setShowAlertSnack({
        open: open,
        message: error,
        type: "error",
      });
    }
    //     try {
    //       if (newPhoneNumber !== "") {
    //         // Verifica si el nuevo servicio no está vacío
    //         await axios.put(`${VITE_BACKEND_URL}/users/update`, {
    //           phoneNumber: [newPhoneNumber],
    //         });
    //         // Refresca la lista de servicios después de agregar uno nuevo
    //         setNewService("");
    //         setRefresh(!refresh);
    //       }
    //     } catch (error) {
    //       console.error("Error al agregar el servicio:", error);
    //       alert("Error al agregar el servicio");
    //     }
  };
  return (
    <>
      <AlertSnackBar
        showAlertSnack={showAlertSnack}
        setShowAlertSnack={setShowAlertSnack}
      />
      <List
        sx={{ width: "100%" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <Box sx={{ marginBottom: "10px" }}>
            <h3>Mi perfil</h3>
            <hr />
          </Box>
        }
      >
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
            <LocalPhoneIcon />
            <h3 sx={{ fontFamily: "Jost,sans-serif" }}>Teléfono</h3>
          </Box>
          {openSection === "telefono" ? (
            <ExpandLess />
          ) : (
            <ExpandMore sx={{ color: "#2196f3" }} />
          )}
        </ListItemButton>
        <Collapse in={openSection === "telefono"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Input
                type="text"
                value={newPhoneNumber}
                placeholder="ej: 011493523"
                onChange={(e) => handleSetPhoneState(e.target.value)}
                onKeyDown={handleKeyDown} // Manejar el evento onKeyDown
                sx={{
                  fontFamily: "Jost, sans-serif",
                  fontSize: "20px",
                  borderRadius: "50px",
                  width: "80%",
                }}
              />
              <Button
                color="success"
                sx={{ width: "20%", borderRadius: "50px" }}
                onClick={handleUpdatePhone}
              >
                <DoneOutlineIcon sx={{ color: "green" }} />
              </Button>
            </Box>
          </List>
        </Collapse>

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
            <CalendarMonthIcon />
            <h3 sx={{ fontFamily: "Jost,sans-serif" }}>Mis turnos</h3>
          </Box>
          {openSection === "turnos" ? (
            <ExpandLess />
          ) : (
            <ExpandMore sx={{ color: "#2196f3" }} />
          )}
        </ListItemButton>
        <Collapse in={openSection === "turnos"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding></List>
        </Collapse>
      </List>
    </>
  );
};
export default ClientNestedList;
