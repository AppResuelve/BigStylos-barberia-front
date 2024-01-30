import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Box, Button, Input, MenuItem, Select } from "@mui/material";
import formatHour from "../../functions/formatHour";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import IosSwitch from "../interfazMUI/iosSwitch";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyServices = ({
  workerData,
  email,
  refresh,
  setRefresh,
  setPendingServices,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputService, setInputService] = useState("");
  const [timeEdit, setTimeEdit] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [serviceStatus, setServiceStatus] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [auxState, setAuxState] = useState([]);

  const timeArray = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
    255, 270,
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services/`);
        const { data } = response;
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    setTimeEdit(workerData);
  }, [workerData]);

  useEffect(() => {
    let objNewServicies = {};
    if (services && services.length > 0) {
      for (const prop in workerData) {
        if (services.some((serviceArr) => serviceArr[0] === prop)) {
          if (workerData[prop].duration === null) {
            objNewServicies[prop] = true;
          } else if (workerData[prop].duration === 0) {
            objNewServicies[prop] = false;
          } else {
            objNewServicies[prop] = true;
          }
        }
      }
    }
    if (!showEdit) {
      setServiceStatus(objNewServicies);
    }
  }, [services, workerData, showEdit]);

  useEffect(() => {
    if (timeEdit && Object.keys(timeEdit).length > 0) {
      if (services && services.length > 0) {
        let aux = false;
        for (const prop in timeEdit) {
          if (services.some((serviceArr) => serviceArr[0] === prop)) {
            if (timeEdit[prop].duration === null) {
              aux = true;
              setPendingServices(aux);
              return;
            } else {
              aux = false;
            }
            setPendingServices(aux);
          }
        }
      }
    }
  }, [timeEdit, services]);
  useEffect(() => {
    if (serviceStatus[auxState[0]] && auxState !== false) {
      setTimeEdit((prevState) => ({
        ...prevState,
        [auxState[0]]: {
          ...prevState[auxState[0]],
          duration: null,
        },
      }));
    } else if (!serviceStatus[auxState[0]] && auxState !== false) {
      setTimeEdit((prevState) => ({
        ...prevState,
        [auxState[0]]: {
          ...prevState[auxState[0]],
          duration: 0,
        },
      }));
    }
  }, [auxState]);

  const handleServiceStatus = (element) => {
    setServiceStatus((prevState) => {
      let newState = { ...prevState };
      newState[element] = !newState[element];
      return newState;
    });
    setAuxState([element, !serviceStatus[element]]);
  };

  const handleSelectChange = (event, element) => {
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
    setTimeEdit(workerData);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/users/update`, {
        email: email,
        newServicesDuration: timeEdit,
      });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error al actulizar los servicios", error);
      alert("Error al actulizar los servicios");
    }
    setShowEdit(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <hr
        style={{
          width: "100%",
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
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
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {services && services.length > 0 ? (
          services
            .filter((service) =>
              service[0].toLowerCase().includes(searchValue.toLowerCase())
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
                  <h3 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                    {element[0]}
                  </h3>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: sm ? "100%" : "50%",
                    }}
                  >
                    {/* //// IOSSwicth //// */}
                    <IosSwitch
                      index={index}
                      element={element[0]}
                      timeEdit={timeEdit}
                      showEdit={showEdit}
                      serviceStatus={serviceStatus}
                      setServiceStatus={setServiceStatus}
                      handleServiceStatus={handleServiceStatus}
                    />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {timeEdit[element[0]].duration === null &&
                        serviceStatus && (
                          <h3 style={{ color: "red" }}>Pendiente</h3>
                        )}
                      {timeEdit[element[0]].duration == 0 ? (
                        <h3 style={{ marginRight: "40px" }}>-----</h3>
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
                          value={
                            timeEdit[element[0]].duration === null
                              ? 0
                              : timeEdit[element[0]].duration
                          }
                          onChange={(event) =>
                            handleSelectChange(event, element[0])
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
            <h2>
              {loading ? "Cargando servicios" : "No hay servicios todavía"}
            </h2>
          </Box>
        )}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        {showEdit === false && (
          <Button onClick={handleEdit}>
            <BorderColorIcon />
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
              variant="outlined"
              style={{ borderRadius: "50px", border: "2px solid " }}
            >
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Volver</h4>
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};
export default MyServices;
