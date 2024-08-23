import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";
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
  services,
  serviceStatus,
  setServiceStatus,
  timeEdit,
  setTimeEdit,
  showEdit,
  setShowEdit,
  setChangeNoSaved,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);
  const [inputService, setInputService] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [auxState, setAuxState] = useState([]);

  const timeArray = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
    255, 270,
  ];

  console.log(services);
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  
  useEffect(() => {
    if (timeEdit) {
      //condicional de estado 0 de la app
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
    }
  }, [auxState]);

  const handleServiceStatus = (element) => {
    setChangeNoSaved(true)
    setServiceStatus((prevState) => {
      let newState = { ...prevState };
      newState[element] = !newState[element];
      return newState;
    });
    setAuxState([element, !serviceStatus[element]]);
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
    setTimeEdit(workerData);
    setChangeNoSaved(false);
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
    setChangeNoSaved(false);

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
                  <h3 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                    {element.name}
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
                      element={element.name}
                      timeEdit={timeEdit}
                      showEdit={showEdit}
                      serviceStatus={serviceStatus}
                      setServiceStatus={setServiceStatus}
                      handleServiceStatus={handleServiceStatus}
                    />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {timeEdit &&
                        Object.keys(timeEdit).length > 0 &&
                        timeEdit[element.name].duration === null &&
                        serviceStatus && (
                          <h3 style={{ color: "red" }}>Pendiente</h3>
                        )}
                      {timeEdit[element.name].duration == 0 ? (
                        <h3
                          style={{
                            marginRight: "40px",
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
                          value={
                            timeEdit[element.name].duration === null
                              ? 0
                              : timeEdit[element.name].duration
                          }
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
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        {showEdit === false && (
          <Button
            disabled={services !== 1 && services.length == 0 ? true : false}
            onClick={handleEdit}
          >
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
