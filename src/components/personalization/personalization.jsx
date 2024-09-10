import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { Box, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
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
import { checkChangeToSave } from "../../helpers/checkChangeToSave";
import toastAlert from "../../helpers/alertFunction";
import axios from "axios";
import "./personalization.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const VITE_CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const Personalization = ({
  services,
  refreshServices,
  setRefreshServices,
  setChangeNoSaved,
}) => {
  const {
    darkMode,
    homeImages,
    setHomeImages,
    refreshPersonalization,
    setRefreshPersonalization,
  } = useContext(ThemeContext);
  const [imgServices, setImgServices] = useState([]); //images de los services basado en el estado services
  const [auxImgServices, setAuxImgServices] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
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
  const [auxHomeImages, setAuxHomeImages] = useState([]); //images del home basado ene le estado homeImages
  const [colors, setColors] = useState("#ffffff");
  const [auxColorSelected, setAuxColorSelected] = useState("#ffffff");
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/personalization`);
        setHomeImages(response.data.allImages);
        setAuxHomeImages(JSON.parse(JSON.stringify(response.data.allImages))); // Crear una copia profunda del array
        setColors(response.data.allColors);
        setAuxColorSelected(
          JSON.parse(JSON.stringify(response.data.allColors))
        ); // Crear una copia profunda del array
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
    if (auxImgServices.length > 0 && toggle.services) {
      const someServiceToUpdate = filterImgServicesToUpdate(
        auxImgServices,
        imgServices
      );

      if (someServiceToUpdate) {
        setDisableSaveBtn((prevState) => ({
          ...prevState,
          services: false,
        }));
        setChangeNoSaved((prevState) => ({
          ...prevState,
          services: true,
        }));
      } else {
        setDisableSaveBtn((prevState) => ({
          ...prevState,
          services: true,
        }));
        setChangeNoSaved((prevState) => {
          let copyState = { ...prevState, services: false };
          let check = checkChangeToSave(copyState);
          if (!check) copyState = {};
          return copyState;
        });
      }
    }
  }, [auxImgServices]);

  useEffect(() => {
    if (auxHomeImages.length > 0 && toggle.home) {
      if (
        auxHomeImages[0][1] !== homeImages[0][1] ||
        auxHomeImages[1][1] !== homeImages[1][1]
      ) {
        setDisableSaveBtn((prevState) => ({
          ...prevState,
          home: false,
        }));
        setChangeNoSaved((prevState) => ({
          ...prevState,
          home: true,
        }));
      } else {
        setDisableSaveBtn((prevState) => ({
          ...prevState,
          home: true,
        }));
        setChangeNoSaved((prevState) => {
          let copyState = { ...prevState, home: false };
          let check = checkChangeToSave(copyState);
          if (!check) copyState = {};
          return copyState;
        });
      }
    }
  }, [auxHomeImages]);

  useEffect(() => {
    if (auxColorSelected.length > 0 && toggle.colors) {
      if (auxColorSelected[0] !== colors[0]) {
        setDisableSaveBtn((prevState) => ({
          ...prevState,
          colors: false,
        }));
        setChangeNoSaved((prevState) => ({
          ...prevState,
          colors: true,
        }));
      } else {
        setDisableSaveBtn((prevState) => ({
          ...prevState,
          colors: true,
        }));
        setChangeNoSaved((prevState) => {
          let copyState = { ...prevState, colors: false };
          let check = checkChangeToSave(copyState);
          if (!check) copyState = {};
          return copyState;
        });
      }
    }
  }, [auxColorSelected]);

  // Función para manejar el cambio de imagenes seleccionadas
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
    //estado d loading true hasta que se carga la imagen
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
    } else {
      setAuxHomeImages((prevImages) => {
        let copyOfArray = [...prevImages];

        if (nameSection === "logotipo") {
          copyOfArray[0][1] = secure_url;
        } else if (nameSection === "fondo-de-pantalla") {
          copyOfArray[1][1] = secure_url;
        }
        return copyOfArray;
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
        toastAlert("Cambios de inicio guardados exitosamente.", "success");
        setHomeImages(response.data);
        setAuxHomeImages(JSON.parse(JSON.stringify(response.data))); // Crear una copia profunda del array
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
        console.error("Error al actualizar las imagenes", error);
      }
    } else if (toggle.colors) {
      try {
        const response = await axios.put(
          `${VITE_BACKEND_URL}/personalization/update`,
          {
            newColors: auxColorSelected,
          }
        );
        toastAlert("Cambio de color exitoso.", "success");
        setColors(response.data);
        setAuxColorSelected(JSON.parse(JSON.stringify(response.data))); // Crear una copia profunda del array
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
        console.error("Error al actualizar el color", error);
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
          toastAlert("Cambios de servicios guardados exitosamente.", "success");
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
          toastAlert("Error al actulizar los servicios.", "error");
          console.error("Error al actulizar los servicios", error);
        }
      }
    }
    if (toggle.home || toggle.colors)
      setRefreshPersonalization(!refreshPersonalization);
  };

  const handleToggle = (section) => {
    setToggle({ home: false, services: false, colors: false, [section]: true });
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
                          width: "90px",
                          height: "90px",
                          borderRadius: "150px",
                          marginRight: "5px",
                          objectFit: "cover",
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
              sx={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
            >
              Descartar
            </Button>
            {/* 1 BOTON GUARDAR POR CADA SECCION (3 BTN)*/}
            {toggle.home && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={disableSaveBtn.home ? true : false}
                sx={{ fontFamily: "Jost, sans-serif" }}
              >
                Guardar inicio
              </Button>
            )}
            {toggle.services && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={disableSaveBtn.services ? true : false}
                sx={{ fontFamily: "Jost, sans-serif" }}
              >
                Guardar servicios
              </Button>
            )}
            {toggle.colors && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={disableSaveBtn.colors ? true : false}
                sx={{ fontFamily: "Jost, sans-serif" }}
              >
                Guardar color
              </Button>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};
export default Personalization;
