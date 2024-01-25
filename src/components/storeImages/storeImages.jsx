import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import noImg from "../../assets/icons/no-image.png";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import "./storeImages.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const VITE_CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const StoreImages = () => {
  const [services, setServices] = useState([]); //servicios array de array con service name y url img
  const [imgServices, setImgServices] = useState([]); //images de los services basado en el estado services
  const [homeImages, setHomeImages] = useState([]); //images del home
  const [auxHomeImages, setAuxHomeImages] = useState([]); //images del home basado ene le estado homeImages
  const [showEdit, setShowEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [toggle, setToggle] = useState(false);

  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services`);
        const { data } = response;
        setServices(data);
        setImgServices(data);
        //  setLoading(false);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/images`);
        const { data } = response;
        setHomeImages(data);
        setAuxHomeImages(data);
        //  setLoading(false);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
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

  const uploadImage = async (event) => {
    const name = event.target.name;
    const files = event.target.files;
    if (name === "fondo-central" || name === "fondo-de-pantalla") {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "Inicio");

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
      data.append("upload_preset", "Mis servicios");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );

      const { secure_url } = res.data;

      // Actualiza el array de arrays con la nueva secure_url
      updateImageInArray(name, secure_url);
    }
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setImgServices(services);
    setAuxHomeImages(homeImages);
    setRefresh(!refresh);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/services/updateimg`,
        {
          servicesWithImg: imgServices,
        }
      );
      // setRefresh(!refresh);
    } catch (error) {
      console.error("Error al actulizar los servicios", error);
      alert("Error al actulizar los servicios");
    }
    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/images/update`, {
        newImages: auxHomeImages,
      });
      // setRefresh(!refresh);
    } catch (error) {
      console.error("Error al actulizar las imgenes", error);
      alert("Error al actulizar las imgenes");
    }
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
      <Box>
        <Box sx={{ width: "100%" }}>
          <Button
            variant={!toggle ? "contained" : "outlined"}
            onClick={() => setToggle(false)}
            sx={{
              width: "50%",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
            }}
          >
            Mis servicios
          </Button>
          <Button
            variant={toggle ? "contained" : "outlined"}
            onClick={() => setToggle(true)}
            sx={{
              width: "50%",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
            }}
          >
            Inicio
          </Button>
        </Box>
        {/* /////// SECCION MIS SERVICIOS //////// */}
        {!toggle ? (
          imgServices.map((service, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    marginTop: "20px",
                    minHeight: "90px",
                    maxHeight: "150px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3 style={{ marginBottom: "7px" }}>{service[0]}</h3>
                  <label
                    htmlFor={`fileInput-${service[0]}`}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        showEdit
                          ? "span-input-store-images"
                          : "span-input-store-images-false"
                      }
                      style={{
                        marginBottom: "5px",
                        borderRadius: "5px",
                        padding: "5px",
                        fontWeight: "bold",
                        cursor: showEdit ? "pointer" : "not-allowed",
                        display: "flex",
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
                    src={service.length > 0 && service[1] ? service[1] : noImg}
                    alt="img-servicio"
                    style={{
                      width: sm ? "90px" : "150px",
                      borderRadius: "3px",
                    }}
                  />
                </Box>
              </Box>
            );
          })
        ) : (
          /* /////// SECCION INICIO /////// */
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Box
                sx={{
                  marginTop: "20px",
                  minHeight: "90px",
                  maxHeight: "90px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ marginBottom: "7px" }}>fondo central</h3>
                <label htmlFor="home" style={{ cursor: "pointer" }}>
                  <span
                    className={
                      showEdit
                        ? "span-input-store-images"
                        : "span-input-store-images-false"
                    }
                    style={{
                      display: "flex",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      padding: "5px",
                      cursor: showEdit ? "pointer" : "not-allowed",
                      fontWeight: "bold",
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
                  src={auxHomeImages.length > 0 ? auxHomeImages[0] : noImg}
                  alt="img-logo"
                  style={{
                    width: sm ? "90px" : "150px",
                    borderRadius: "3px",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ marginBottom: "7px" }}>fondo de pantalla</h3>
                <label
                  htmlFor="fondo-de-pantalla"
                  style={{ cursor: "pointer" }}
                >
                  <span
                    className={
                      showEdit
                        ? "span-input-store-images"
                        : "span-input-store-images-false"
                    }
                    style={{
                      display: "flex",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      padding: "5px",
                      cursor: showEdit ? "pointer" : "not-allowed",
                      fontWeight: "bold",
                    }}
                  >
                    Selecciona una imagen
                    <AttachFileIcon />
                  </span>
                  <input
                    type="file"
                    id="fondo-de-pantalla"
                    name="fondo-de-pantalla"
                    onChange={uploadImage}
                    disabled={!showEdit ? true : false}
                    style={{ display: "none" }}
                  />
                </label>
              </Box>
              <Box>
                <img
                  src={auxHomeImages.length > 0 ? auxHomeImages[1] : noImg}
                  alt="img-fondo-pantalla"
                  style={{
                    width: sm ? "90px" : "150px",
                    borderRadius: "3px",
                  }}
                />
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
export default StoreImages;
