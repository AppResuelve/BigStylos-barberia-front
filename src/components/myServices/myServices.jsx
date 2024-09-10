import { useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import {
  Box,
  Button,
  Input,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";
import formatHour from "../../functions/formatHour";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import axios from "axios";
import "../interfazUiverse.io/checkBox.css";
import Swal from "sweetalert2";
import serviceIcon from "../../assets/icons/review.png";
import toastAlert from "../../helpers/alertFunction";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyServices = ({
  userData,
  refresh,
  setRefresh,
  services,
  timeEdit,
  setTimeEdit,
  changeNoSaved,
  setChangeNoSaved,
  pendingServices,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [inputService, setInputService] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [showEdit, setShowEdit] = useState(false);

  const timeArray = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
    255, 270,
  ];

  const handleServiceStatus = (element, checked) => {
    setChangeNoSaved(true);
    setTimeEdit((prevState) => ({
      ...prevState,
      [element]: {
        ...prevState[element],
        duration: checked ? 0 : null,
      },
    }));
  };

  const handleSelectChange = (event, element) => {
    setChangeNoSaved(true);
    const value = event.target.value;
    setTimeEdit((prevState) => ({
      ...prevState,
      [element]: {
        ...prevState[element],
        duration: value,
      },
    }));
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setTimeEdit(userData.services);
    setChangeNoSaved(false);
  };

  const handleSubmit = async () => {
    if (pendingServices) {
      Swal.fire({
        title: "Tienes cambios sin guardar",
        icon: "warning",
      });
    } else {
      try {
        const response = await axios.put(`${VITE_BACKEND_URL}/users/update`, {
          email: userData.email,
          newServicesDuration: timeEdit,
        });
        toastAlert("Cambios guardados exitosamente.", "success");
        setRefresh(!refresh);
      } catch (error) {
        toastAlert("Error al actulizar los servicios.", "error");
        console.error("Error al actulizar los servicios", error);
      }
      setShowEdit(false);
      setChangeNoSaved(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {services !== 1 ? (
        <hr
          style={{
            width: "100%",
            marginBottom: "15px",
            border: "none",
            height: "2px",
            backgroundColor: "#2196f3",
          }}
        />
      ) : (
        <LinearProgress />
      )}
      {/* box input search */}
      <Box
        style={{
          width: "100%",
          maxWidth: "500px",
          marginBottom: "15px",
        }}
      >
        <Input
          id="input-search-services-status"
          type="text"
          value={inputService}
          placeholder="Buscar un servicio"
          onChange={(e) => {
            setInputService(e.target.value), setSearchValue(e.target.value);
          }}
          style={{
            fontFamily: "Jost, sans-serif",
            fontWeight: "bold",
            fontSize: "20px",
            width: "100%",
            borderRadius: "5px",
            paddingLeft: "10px",
            backgroundColor: darkMode.on ? "white" : "#d6d6d5",
          }}
        />
      </Box>
      {/* box servicios/selects */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          maxHeight: "400px",
        }}
      >
        {services && services.length > 0 ? (
          services
            .filter((service) =>
              service.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((element, index) => {
              return (
                <Box
                  key={index}
                  style={{
                    width: "100%",
                    display: sm ? "" : "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: sm ? "5px" : "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "5px" }}>
                    <img
                      src={element.img !== "" ? element.img : serviceIcon}
                      alt="imagen servicio"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "30px",
                        objectFit: "cover",
                      }}
                    />
                    <h3
                      style={{ color: darkMode.on ? "white" : darkMode.dark }}
                    >
                      {element.name}
                    </h3>
                  </div>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: sm ? "100%" : "50%",
                    }}
                  >
                    <div
                      className={
                        showEdit
                          ? "container-switch"
                          : "container-switch-disabled"
                      }
                    >
                      <input
                        type="checkbox"
                        className="checkbox"
                        id={`checkbox-${index}`} /* ID único basado en el índice */
                        disabled={showEdit ? false : true}
                        checked={
                          timeEdit[element.name].duration === null
                            ? false
                            : true
                        }
                        onClick={(e) => {
                          handleServiceStatus(element.name, e.target.checked);
                        }}
                      />
                      <label className="switch" htmlFor={`checkbox-${index}`}>
                        <span className="slider"></span>
                      </label>
                    </div>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {timeEdit &&
                        Object.keys(timeEdit).length > 0 &&
                        timeEdit[element.name].duration === 0 && (
                          <h3 style={{ color: "red" }}>Pendiente</h3>
                        )}
                      {timeEdit[element.name].duration === null ? (
                        <h3
                          style={{
                            marginRight: "40px",
                            height: "40px",
                            color: darkMode.on ? "white" : darkMode.dark,
                          }}
                        >
                          -----
                        </h3>
                      ) : (
                        <Select
                          key={index + 40}
                          id={`input-time-duration-${index}`}
                          sx={{
                            height: "40px",
                            width: "100px",
                            marginLeft: "10px",
                            backgroundColor: darkMode.on ? "white" : "#d6d6d5",
                            fontFamily: "Jost, sans-serif",
                            fontWeight: "bold",
                          }}
                          disabled={showEdit ? false : true}
                          value={timeEdit[element.name].duration}
                          onChange={(event) =>
                            handleSelectChange(event, element.name)
                          }
                        >
                          {timeArray.map((minute, index) => (
                            <MenuItem
                              key={index}
                              id={`menuItem-select-myServices-${index}`}
                              value={minute}
                              disabled={minute === 0 ? true : false}
                              style={{
                                fontFamily: "Jost, sans-serif",
                                fontWeight: "bold",
                              }}
                            >
                              {minute === 0 ? "..." : formatHour(minute)}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Box>
                  </Box>
                  {sm && <hr style={{ marginTop: "5px" }} />}
                </Box>
              );
            })
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingTop: "15px",
            }}
          >
            <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
              {services !== 1 &&
                services.length < 1 &&
                "No hay servicios todavía"}
            </h2>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "20px",
        }}
      >
        {showEdit === false && (
          <Button
            disabled={services !== 1 && services.length == 0 ? true : false}
            onClick={handleEdit}
          >
            <CreateRoundedIcon />
          </Button>
        )}
        {showEdit === true && (
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleCancel}
              sx={{ fontFamily: "Jost, sans-serif" }}
            >
              Descartar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!changeNoSaved}
              sx={{ fontFamily: "Jost, sans-serif", width: "100px" }}
              variant="contained"
            >
              Guardar
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};
export default MyServices;
