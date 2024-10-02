import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import ListItemButton from "@mui/material/ListItemButton";
import phoneIcon from "../../assets/icons/phone.png";
import calendarIcon from "../../assets/icons/calendar.png";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, List } from "@mui/material";
import MyTurns from "../myTurns/myTurns";
import InputTel from "../inputTel/inputTel";
import Swal from "sweetalert2";
import axios from "axios";
import "./clientNestedList.css";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ClientNestedList = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData, openSection, setOpenSection } = useContext(AuthContext);
  const { newTurnNotification, setNewTurnNotification } = useContext(
    LoadAndRefreshContext
  );
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

  useEffect(() => {
    if (openSection.turnos) setNewTurnNotification(false);
  }, [openSection]);

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
        <div className="container-img-span-clientlist">
          <img src={phoneIcon} alt="mi teléfono" />
          <span className="span-nestedList">Mi teléfono</span>
        </div>
        {openSection.telefono ? (
          <ExpandLess sx={{ color: "var(--text-color)" }} />
        ) : (
          <ExpandMore sx={{ color: "var(--accent-color)" }} />
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
              <span style={{ color: !darkMode.on && "white" }}>Guardar</span>
            </button>
          </div>
        </List>
      </Collapse>
      <hr className="hr-userModal" />
      {/*////// contenido de seccion turnos dentro de miperfil //////*/}
      <ListItemButton
        className="listItembtn-nestedList"
        onClick={() => handleSectionClick("turnos")}
      >
        <div className="container-img-span-clientlist">
          {newTurnNotification && (
            <label htmlFor="" className="label-notification-nestedList"></label>
          )}
          <img src={calendarIcon} alt="mis turnos" />
          <span className="span-nestedList">Mis turnos</span>
        </div>
        {openSection.turnos ? (
          <ExpandLess sx={{ color: "var(--text-color)" }} />
        ) : (
          <ExpandMore sx={{ color: "var(--accent-color)" }} />
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
      <hr className="hr-userModal" />
    </div>
  );
};
export default ClientNestedList;
