import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { Box, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import noImg from "../../assets/icons/no-image.png";
import commingSoon from "../../assets/images/coming-soon.png";
import noImageLogotipe from "../../assets/icons/no-image-logotipe.png";
import noImageLogotipeLight from "../../assets/icons/no-image-logotipe-light.png";
import FormatPaintOutlinedIcon from "@mui/icons-material/FormatPaintOutlined";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import {
  convertToServicesImgArray,
  filterImgServicesToUpdate,
} from "../../helpers/convertCategoryService";
import "./personalization.css";
import axios from "axios";
import { checkChangeToSave } from "../../helpers/checkChangeToSave";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const VITE_CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const Personalization = ({
  services,
  refreshServices,
  setRefreshServices,
  setChangeNoSaved,
}) => {
  const { darkMode, setRefreshPersonalization } =
    useContext(DarkModeContext);
  const [imgServices, setImgServices] = useState([]); //images de los services basado en el estado services
  const [auxImgServices, setAuxImgServices] = useState([]); //images de los services basado en el estado services copia
  const [homeImages, setHomeImages] = useState([]); //images del home
  const [auxHomeImages, setAuxHomeImages] = useState([]); //images del home basado ene le estado homeImages
  const [colors, setColors] = useState("#ffffff");
  const [auxColorSelected, setAuxColorSelected] = useState("#ffffff");
  const [showEdit, setShowEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [toggle, setToggle] = useState({
    home: true,
    services: false,
    colors: false,
  });
  const [disableSaveBtn, setDisableSaveBtn] = useState({
    home: true,
    services: true,
    colors: true,
  });
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/personalization`);
        const { data } = response;
        setHomeImages(data.allImages);
        setAuxHomeImages(JSON.parse(JSON.stringify(data.allImages))); // Crear una copia profunda del array
        setColors(data.allColors);
        setAuxColorSelected(JSON.parse(JSON.stringify(data.allColors))); // Crear una copia profunda del array
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const servicesImg = convertToServicesImgArray(services);
    setImgServices(servicesImg);
    setAuxImgServices(JSON.parse(JSON.stringify(servicesImg))); // Crear una copia profunda del array
  }, [services]);

  useEffect(() => {
    if (
      auxHomeImages.length > 0 &&
      auxImgServices.length > 0 &&
      auxColorSelected.length > 0
    ) {
      if (toggle.services) {
        // Determinar si algún servicio se actualizó
        const someServiceToUpdate = filterImgServicesToUpdate(
          auxImgServices,
          imgServices
        );

        // Actualizar estado dependiendo de si hay cambios
        if (someServiceToUpdate) {
          setDisableSaveBtn((prevState) => {
            let saveBtn = { ...prevState };
            saveBtn.services = false;
            return saveBtn;
          });
          setChangeNoSaved((prevState) => {
            let copyState = { ...prevState };
            copyState.services = true;
            return copyState;
          });
        } else {
          setDisableSaveBtn((prevState) => {
            let saveBtn = { ...prevState };
            saveBtn.services = true;
            return saveBtn;
          });
          setChangeNoSaved((prevState) => {
            let copyState = { ...prevState };

            copyState.services = false;
            let check = checkChangeToSave(copyState);
            if (!check) copyState = {};
            return copyState;
          });
        }
      } else if (toggle.home) {
        if (
          auxHomeImages[0][1] !== homeImages[0][1] ||
          auxHomeImages[1][1] !== homeImages[1][1]
        ) {
          setDisableSaveBtn((prevState) => {
            let saveBtn = { ...prevState };
            saveBtn.home = false;
            return saveBtn;
          });
          setChangeNoSaved((prevState) => {
            let copyState = { ...prevState };
            copyState.home = true;
            return copyState;
          });
        } else {
          setDisableSaveBtn((prevState) => {
            let saveBtn = { ...prevState };
            saveBtn.home = true;
            return saveBtn;
          });
          setChangeNoSaved((prevState) => {
            let copyState = { ...prevState };
            copyState.home = false;
            let check = checkChangeToSave(copyState);
            if (!check) copyState = {};
            return copyState;
          });
        }
      } else if (toggle.colors) {
        if (auxColorSelected[0] !== colors[0]) {
          setDisableSaveBtn((prevState) => {
            let saveBtn = { ...prevState };
            saveBtn.colors = false;
            return saveBtn;
          });
          setChangeNoSaved((prevState) => {
            let copyState = { ...prevState };
            copyState.colors = true;
            return copyState;
          });
        } else {
          setDisableSaveBtn((prevState) => {
            let saveBtn = { ...prevState };
            saveBtn.colors = true;
            return saveBtn;
          });
          setChangeNoSaved((prevState) => {
            let copyState = { ...prevState };
            copyState.colors = false;
            let check = checkChangeToSave(copyState);
            if (!check) copyState = {};
            return copyState;
          });
        }
      }
    }
  }, [auxHomeImages, auxImgServices, auxColorSelected]);

  const uploadImage = async (event, nameSection) => {
    const name = event.target.name;
    const files = event.target.files;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", nameSection);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );
    const { secure_url } = res.data;

    if (toggle.services) {
      // Actualiza el array de arrays con la nueva secure_url
      setAuxImgServices((prevAuxImgServices) => {
        let copyOfArray = [...prevAuxImgServices];

        // Modificar copyOfArray según tu lógica
        copyOfArray.map((arr, index) => {
          if (arr[0] === name) {
            copyOfArray[index][1] = secure_url;
          }
        });

        // Devolver la nueva copia del array actualizado
        return copyOfArray;
      });
    } else if (toggle.home) {
      setAuxHomeImages((prevImages) => {
        let copyOfArray = [...prevImages];

        if (nameSection === "logotipo") {
          copyOfArray[0][1] = secure_url;
        } else if (nameSection === "fondo-de-pantalla") {
          copyOfArray[1][1] = secure_url;
        }
        return copyOfArray;
      });
    } else {
      setAuxColorSelected((prevState) => {
        let copyState = [...prevState];
        copyState = secure_url;
        return copyState;
      });
    }
  };

  // Función para manejar el cambio en el color seleccionado
  const handleColorSelected = (event) => {
    setAuxColorSelected(event.target.value);
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    if (toggle.home) {
      setAuxHomeImages(JSON.parse(JSON.stringify(homeImages)));
      setDisableSaveBtn((prevState) => {
        const saveBtn = { ...prevState };
        saveBtn.home = true;
        return saveBtn;
      });
      setChangeNoSaved((prevState) => {
        let copyState = { ...prevState };
        copyState.home = false;
        const check = checkChangeToSave(copyState);
        if (!check) copyState = {};
        return copyState;
      });
    } else if (toggle.services) {
      setAuxImgServices(JSON.parse(JSON.stringify(imgServices)));
      setDisableSaveBtn((prevState) => {
        const saveBtn = { ...prevState };
        saveBtn.services = true;
        return saveBtn;
      });
      setChangeNoSaved((prevState) => {
        let copyState = { ...prevState };
        copyState.services = false;
        const check = checkChangeToSave(copyState);
        if (!check) copyState = {};
        return copyState;
      });
    } else {
      setAuxColorSelected(JSON.parse(JSON.stringify(colors)));
      setDisableSaveBtn((prevState) => {
        const saveBtn = { ...prevState };
        saveBtn.colors = true;
        return saveBtn;
      });
      setChangeNoSaved((prevState) => {
        let copyState = { ...prevState };
        copyState.colors = false;
        const check = checkChangeToSave(copyState);
        if (!check) copyState = {};
        return copyState;
      });
    }
  };

  const handleSubmit = async () => {
    if (toggle.home) {
      try {
        const response = await axios.put(
          `${VITE_BACKEND_URL}/personalization/update`,
          {
            newImages: auxHomeImages,
          }
        );
        setRefreshPersonalization((prevState) => {
          const copyState = { ...prevState };
          copyState.home = true;
          return copyState;
        });
        setDisableSaveBtn((prevState) => {
          const saveBtn = { ...prevState };
          saveBtn.home = true;
          return saveBtn;
        });
        setChangeNoSaved((prevState) => {
          let copyState = { ...prevState };
          copyState.home = false;
          const check = checkChangeToSave(copyState);
          if (!check) copyState = {};
          return copyState;
        });
        setShowEdit(false);
      } catch (error) {
        console.error("Error al actulizar las imgenes", error);
      }
    } else if (toggle.colors) {
      try {
        const response = await axios.put(
          `${VITE_BACKEND_URL}/personalization/update`,
          {
            newColors: auxColorSelected,
          }
        );
        setRefreshPersonalization((prevState) => {
          const copyState = { ...prevState };
          copyState.colors = true;
          return copyState;
        });
        setDisableSaveBtn((prevState) => {
          const saveBtn = { ...prevState };
          saveBtn.colors = true;
          return saveBtn;
        });

        setChangeNoSaved((prevState) => {
          let copyState = { ...prevState };
          copyState.colors = false;
          const check = checkChangeToSave(copyState);
          if (!check) copyState = {};
          return copyState;
        });
        setShowEdit(false);
      } catch (error) {
        console.error("Error al actulizar las imgenes", error);
      }
    } else {
      // Determinar si algún servicio se actualizó
      const someServiceToUpdate = filterImgServicesToUpdate(
        auxImgServices,
        imgServices
      );
      if (someServiceToUpdate) {
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/services/updateimg`,
            {
              servicesWithImg: someServiceToUpdate,
            }
          );
          setRefreshServices(!refreshServices);
          setDisableSaveBtn((prevState) => {
            const saveBtn = { ...prevState };
            saveBtn.services = true;
            return saveBtn;
          });
          setChangeNoSaved((prevState) => {
            let copyState = { ...prevState };
            copyState.services = false;
            const check = checkChangeToSave(copyState);
            if (!check) copyState = {};
            return copyState;
          });
          setShowEdit(false);
        } catch (error) {
          console.error("Error al actulizar los servicios", error);
        }
      }
    }
  };

  const handleToggle = (section) => {
    setToggle((prevToggle) => {
      // Inicializar el nuevo estado de toggle
      const newToggle = { home: false, services: false, colors: false };

      // Establecer la sección seleccionada a true
      newToggle[section] = true;

      return newToggle;
    });
  };

  return (
    <div>
      <hr
        style={{
          width: "100%",
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      {/* ///// SECCION BOTONES IMAGENES Y COLORES ///// */}
      <Box>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          <div style={{ position: "relative" }}>
            <Button
              variant={toggle.home ? "contained" : "outlined"}
              onClick={() => handleToggle("home")}
              style={{
                width: "100%",

                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                border: "none",
                borderBottom: toggle.home ? "" : "3px solid #2196f3",
              }}
            >
              Inicio
            </Button>
            {!disableSaveBtn.home && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(0% - 2px)",
                  right: "calc(0% - 2px)",
                  width: "12px",
                  height: "12px",
                  borderRadius: "10px",
                  backgroundColor: "red",
                  border: "1px solid white",
                  zIndex: "2",
                }}
              ></div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <Button
              variant={toggle.services ? "contained" : "outlined"}
              onClick={() => handleToggle("services")}
              style={{
                width: "100%",
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                border: "none",
                borderBottom: toggle.services ? "" : "3px solid #2196f3",
              }}
            >
              Servicios
            </Button>
            {!disableSaveBtn.services && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(0% - 2px)",
                  right: "calc(0% - 2px)",
                  width: "12px",
                  height: "12px",
                  borderRadius: "10px",
                  backgroundColor: "red",
                  border: "1px solid white",
                  zIndex: "2",
                }}
              ></div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <Button
              variant={toggle.colors ? "contained" : "outlined"}
              onClick={() => handleToggle("colors")}
              style={{
                width: "100%",
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                border: "none",
                borderBottom: toggle.colors ? "" : "3px solid #2196f3",
              }}
            >
              Colores
            </Button>
            {!disableSaveBtn.colors && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(0% - 2px)",
                  right: "calc(0% - 2px)",
                  width: "12px",
                  height: "12px",
                  borderRadius: "10px",
                  backgroundColor: "red",
                  border: "1px solid white",
                  zIndex: "2",
                }}
              ></div>
            )}
          </div>
        </Box>
        {toggle.home && (
          /* /////// SECCION IMAGENES HOME//////// */
          <Box sx={{ marginTop: "15px", marginBottom: "10px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Box
                sx={{
                  minHeight: "90px",
                  maxHeight: "90px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3
                  style={{
                    marginBottom: "7px",
                    color: darkMode.on ? "white" : darkMode.dark,
                  }}
                >
                  fondo logotipo
                </h3>
                <label htmlFor="home" style={{ cursor: "pointer" }}>
                  <span
                    className={
                      showEdit
                        ? "span-input-personalization"
                        : "span-input-personalization-false"
                    }
                    style={{
                      display: "flex",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      padding: "5px",
                      cursor: showEdit ? "pointer" : "not-allowed",
                      fontWeight: "bold",
                      color: darkMode.on ? "white" : darkMode.dark,
                    }}
                  >
                    Selecciona una imagen
                    <AttachFileIcon />
                  </span>
                  <input
                    type="file"
                    id="home"
                    name="logotipo"
                    onChange={(e) => uploadImage(e, "logotipo")}
                    disabled={!showEdit ? true : false}
                    style={{ display: "none" }}
                  />
                </label>
              </Box>
              <Box>
                <img
                  src={
                    auxHomeImages.length > 0 && auxHomeImages[0][1] !== ""
                      ? auxHomeImages[0][1]
                      : darkMode.on
                      ? noImageLogotipeLight
                      : noImageLogotipe
                  }
                  alt="img-logo"
                  style={{
                    width: sm ? "90px" : "150px",
                    height: sm ? "90px" : "150px",
                    borderRadius: "100px",
                    marginRight: "5px",
                    objectFit: "cover",
                    boxShadow: "0px 10px 14px 0px rgba(0,0,0,0.75)",
                    WebkitBoxShadow: "0px 10px 14px 0px rgba(0,0,0,0.75)",
                    MozBoxShadow: "0px 10px 14px 0px rgba(0,0,0,0.75)",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3
                  style={{
                    marginBottom: "7px",
                    color: darkMode.on ? "white" : darkMode.dark,
                  }}
                >
                  fondo de pantalla
                </h3>
                <label
                  htmlFor="fondo-de-pantalla"
                  style={{ cursor: "pointer" }}
                >
                  <span
                    className={
                      //PROXIMAMENTE//
                      /* showEdit
                          ? "span-input-personalization"
                          : */ "span-input-personalization-false"
                    }
                    style={{
                      display: "flex",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      padding: "5px",
                      cursor: /* showEdit ? "pointer" : */ "not-allowed",
                      fontWeight: "bold",
                      color: darkMode.on ? "white" : darkMode.dark,
                    }}
                  >
                    Proximamente
                    {/* <AttachFileIcon /> */}
                  </span>
                  <input
                    type="file"
                    id="fondo-de-pantalla"
                    name="fondo-de-pantalla"
                    onChange={(e) => uploadImage(e, "fondo-de-pantalla")}
                    disabled={true} //PROXIMAMENTE//
                    style={{ display: "none" }}
                  />
                </label>
              </Box>
              <Box>
                <img
                  src={
                    //PROXIMAMENTE//
                    /* auxHomeImages.length > 0 ? auxHomeImages[1][1] : */ commingSoon
                  }
                  alt="img-fondo-pantalla"
                  style={{
                    width: sm ? "90px" : "150px",
                    borderRadius: "3px",
                    marginRight: "5px",
                    filter: "drop-shadow(0px 3px 2px gray)",
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
        {toggle.services && (
          /* /////// SECCION SERVICIOS /////// */
          <Box sx={{ overflow: "scroll", maxHeight: "350px" }}>
            {auxImgServices.length > 0 &&
              auxImgServices.map((service, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "15px",
                    }}
                  >
                    <Box
                      sx={{
                        minHeight: "90px",
                        maxHeight: "150px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: "7px",
                          color: darkMode.on ? "white" : darkMode.dark,
                        }}
                      >
                        {service[0]}
                      </h3>
                      <label
                        htmlFor={`fileInput-${service[0]}`}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            showEdit
                              ? "span-input-personalization"
                              : "span-input-personalization-false"
                          }
                          style={{
                            marginBottom: "5px",
                            borderRadius: "5px",
                            padding: "5px",
                            fontWeight: "bold",
                            cursor: showEdit ? "pointer" : "not-allowed",
                            display: "flex",
                            color: darkMode.on ? "white" : darkMode.dark,
                          }}
                        >
                          Selecciona una imagen
                          <AttachFileIcon />
                        </span>
                        <input
                          type="file"
                          id={`fileInput-${service[0]}`}
                          name={service[0]}
                          onChange={(e) => uploadImage(e, "servicios")}
                          disabled={!showEdit ? true : false}
                          style={{ display: "none" }}
                        />
                      </label>
                    </Box>
                    <Box>
                      <img
                        src={
                          service.length > 0 && service[1] ? service[1] : noImg
                        }
                        alt="img-servicio"
                        style={{
                          width: sm ? "90px" : "150px",
                          borderRadius: "3px",
                          marginRight: "5px",
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            {auxImgServices.length < 1 && (
              <h2
                style={{
                  color: darkMode.on ? "white" : darkMode.dark,
                  display: "flex",
                  justifyContent: "center",
                  padding: "15px",
                }}
              >
                Todavía no hay servicios
              </h2>
            )}
          </Box>
        )}
        {toggle.colors && (
          /* /////// SECCION COLORES /////// */
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              <Box
                sx={{
                  minHeight: "90px",
                  maxHeight: "90px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    marginBottom: "7px",
                    color: darkMode.on ? "white" : darkMode.dark,
                  }}
                >
                  fondo
                </h3>
                <label htmlFor="color fondo" style={{ cursor: "pointer" }}>
                  <span
                    className={
                      showEdit
                        ? "span-input-personalization"
                        : "span-input-personalization-false"
                    }
                    style={{
                      display: "flex",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      padding: "5px",
                      cursor: showEdit ? "pointer" : "not-allowed",
                      fontWeight: "bold",
                      color: darkMode.on ? "white" : darkMode.dark,
                    }}
                  >
                    Selecciona un color
                    <FormatPaintOutlinedIcon />
                  </span>
                  <input
                    type="color"
                    id="color fondo"
                    name="color-fondo"
                    value={auxColorSelected}
                    onChange={(e) => handleColorSelected(e)}
                    disabled={!showEdit ? true : false}
                    style={{ display: "none" }}
                  />
                </label>
              </Box>
              <Box>
                <Box
                  style={{
                    width: sm ? "90px" : "130px",
                    height: sm ? "90px" : "130px",
                    borderRadius: "100px",
                    marginRight: "5px",
                    backgroundColor: auxColorSelected,
                    boxShadow:
                      "0px 15px 25px -16px rgba(0,0,0,0.57)inset,0px 25px 25px -12px rgba(0,0,0,0.57)", // Propiedades de la sombra
                  }}
                ></Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {/* ////// SECCION SHOWEDIT ////// */}
      <hr
        style={{
          width: "100%",
          marginBottom: "14px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
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
              style={{ border: "2px solid " }}
            >
              <h4
                style={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
              >
                Volver
              </h4>
            </Button>
            {/* 1 BOTON GUARDAR POR CADA SECCION (3 BTN)*/}
            {toggle.home && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={disableSaveBtn.home ? true : false}
              >
                <h4 style={{ fontFamily: "Jost, sans-serif" }}>
                  Guardar inicio
                </h4>
              </Button>
            )}
            {toggle.services && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={disableSaveBtn.services ? true : false}
              >
                <h4 style={{ fontFamily: "Jost, sans-serif" }}>
                  Guardar servicios
                </h4>
              </Button>
            )}
            {toggle.colors && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={disableSaveBtn.colors ? true : false}
              >
                <h4 style={{ fontFamily: "Jost, sans-serif" }}>
                  Guardar color
                </h4>
              </Button>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};
export default Personalization;
