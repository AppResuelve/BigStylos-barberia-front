import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Box, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import noImg from "../../assets/icons/no-image.png";
import commingSoon from "../../assets/images/coming-soon.png";
import noImageLogotipe from "../../assets/icons/no-image-logotipe.png";
import noImageLogotipeLight from "../../assets/icons/no-image-logotipe-light.png";
import FormatPaintOutlinedIcon from "@mui/icons-material/FormatPaintOutlined";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import "./personalization.css";
import {
  convertToServicesImgArray,
  filterImgServicesToUpdate,
} from "../../helpers/convertCategoryService";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const VITE_CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const Personalization = ({ services, refreshServices, setRefreshServices }) => {
  const { darkMode, refreshPersonalization, setRefreshPersonalization } =
    useContext(DarkModeContext);
  const [imgServices, setImgServices] = useState([]); //images de los services basado en el estado services
  const [homeImages, setHomeImages] = useState([]); //images del home
  const [auxHomeImages, setAuxHomeImages] = useState([]); //images del home basado ene le estado homeImages
  const [showEdit, setShowEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [colors, setColors] = useState("#ffffff");
  const [colorSelected, setColorSelected] = useState("#ffffff");
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    const servicesImg = convertToServicesImgArray(services);
    setImgServices(servicesImg);
  }, [services]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/personalization`);
        const { data } = response;
        setHomeImages(data.allImages);
        setAuxHomeImages(data.allImages);
        setColors(data.allColors);
        setColorSelected(data.allColors);
        //  setLoading(false);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchImages();
  }, [refresh]);

  const updateImageInArray = (name, secureUrl) => {
    // Copia el array de servicios para no modificar el estado directamente
    const updatedImgServices = [...imgServices];

    // Busca el índice del servicio en el array
    const serviceIndex = updatedImgServices.findIndex(
      (serviceArray) => serviceArray[0] === name
    );

    // Si el servicio existe, actualiza la secure_url en la segunda posición
    if (serviceIndex !== -1) {
      updatedImgServices[serviceIndex][1] = secureUrl;
      // Actualiza el estado con el nuevo array
      setImgServices(updatedImgServices);
    }
  };
  console.log(auxHomeImages);
  const uploadImage = async (event) => {
    const name = event.target.name;
    const files = event.target.files;
    if (name === "fondo-central" || name === "fondo-de-pantalla") {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "logotipo");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );

      const { secure_url } = res.data;

      setAuxHomeImages((prevImages) => {
        let copyOfArray = [...prevImages];

        if (name === "fondo-central") {
          copyOfArray = [
            secure_url,
            ...(prevImages.length > 0 ? [prevImages[1]] : []),
            true,
          ];
        } else {
          copyOfArray = [
            ...(prevImages.length > 0 ? [prevImages[0]] : []),
            secure_url,
          ];
        }

        return copyOfArray;
      });
    } else {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "services");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );

      const { secure_url } = res.data;

      // Actualiza el array de arrays con la nueva secure_url
      updateImageInArray(name, secure_url);
    }
  };

  // Función para manejar el cambio en el color seleccionado
  const handleColorSelected = (event) => {
    setColorSelected(event.target.value);
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setImgServices(services);
    setAuxHomeImages(homeImages);
    setColorSelected(colors);
  };
  const handleSubmit = async () => {
    const someServiceToUpdate = filterImgServicesToUpdate(imgServices);
    if (someServiceToUpdate) {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/services/updateimg`,
          {
            servicesWithImg: someServiceToUpdate,
          }
        );
      } catch (error) {
        console.error("Error al actulizar los servicios", error);
      }
    }
    try {
      const response = await axios.put(
        `${VITE_BACKEND_URL}/personalization/update`,
        {
          newImages: auxHomeImages,
          newColors: colorSelected,
        }
      );
      // setRefresh(!refresh);
    } catch (error) {
      console.error("Error al actulizar las imgenes", error);
    }
    setRefreshPersonalization(!refreshPersonalization);
    setRefreshServices(!refreshServices);
    setShowEdit(false);
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
        <Box sx={{ width: "100%" }}>
          <Button
            variant={!toggle ? "contained" : "outlined"}
            onClick={() => setToggle(false)}
            style={{
              width: "50%",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
              border: "none",
              borderBottom: toggle ? "" : "3px solid #2196f3",
            }}
          >
            Imagenes
          </Button>
          <Button
            variant={toggle ? "contained" : "outlined"}
            onClick={() => setToggle(true)}
            style={{
              width: "50%",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
              border: "none",
              borderBottom: !toggle ? "" : "3px solid #2196f3",
            }}
          >
            Colores
          </Button>
        </Box>
        {/* /////// SECCION IMAGENES //////// */}
        {!toggle ? (
          <Box>
            {/*///// SUB SECCION FONDO LOGOTIPO Y FONDO DE PANTALLA /////*/}
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
                      name="fondo-central"
                      onChange={uploadImage}
                      disabled={!showEdit ? true : false}
                      style={{ display: "none" }}
                    />
                  </label>
                </Box>
                <Box>
                  <img
                    src={
                      auxHomeImages.length > 0
                        ? auxHomeImages[0]
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
                      onChange={uploadImage}
                      disabled={true} //PROXIMAMENTE//
                      style={{ display: "none" }}
                    />
                  </label>
                </Box>
                <Box>
                  <img
                    src={
                      //PROXIMAMENTE//
                      /* auxHomeImages.length > 0 ? auxHomeImages[1] : */ commingSoon
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
            <hr
              style={{
                width: "100%",
                border: "none",
                height: "2px",
                backgroundColor: "#2196f3",
              }}
            />
            <Box sx={{ overflow: "scroll", maxHeight: "350px" }}>
              {imgServices.length > 0 &&
                imgServices.map((service, index) => {
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
                            onChange={uploadImage}
                            disabled={!showEdit ? true : false}
                            style={{ display: "none" }}
                          />
                        </label>
                      </Box>
                      <Box>
                        <img
                          src={
                            service.length > 0 && service[1]
                              ? service[1]
                              : noImg
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
              {imgServices.length < 1 && (
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
          </Box>
        ) : (
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
                    value={colorSelected}
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
                    backgroundColor: colorSelected,
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
              style={{ borderRadius: "50px", border: "2px solid " }}
            >
              <h4
                style={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
              >
                Volver
              </h4>
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
export default Personalization;
