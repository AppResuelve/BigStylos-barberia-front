import { useEffect, useState, useContext } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { DarkModeContext } from "../../App";
import { Box, Button, TextField } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Autocomplete from "@mui/material/Autocomplete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";
import convertToCategoryArray from "../../helpers/convertToCategoryArray";
import DeleteServicesModal from "./deleteServicesModal";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Services = ({
  refreshServices,
  setRefreshServices,
  loadingServices,
  services,
  setServices,
  setLoadingServices,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(DarkModeContext);
  const [serviceInput, setServiceInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [categoryServices, setCategoryServices] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (services) {
      const categoryArray = convertToCategoryArray(services);

      const extractedCategories = Object.keys(services);
      const extractedServices = [];

      for (const category of extractedCategories) {
        extractedServices.push(...Object.keys(services[category]));
      }
      setCategoryServices(categoryArray);
      setCategoryList(extractedCategories);
      setServiceList(extractedServices);
    }
  }, [services]);

  const handleKeyDown = (e) => {
    // Manejar el evento cuando se presiona Enter
    if (e.keyCode === 13) {
      e.preventDefault(); // Evitar que se agregue un salto de línea en el Input
      handleAddService();
    }
  };

  const handleAddServiceCategory = async () => {
    try {
      if (serviceInput !== "" && categoryInput !== "") {
        // Verifica si el nuevo servicio no está vacío
        await axios.post(`${VITE_BACKEND_URL}/services/create`, {
          service: serviceInput,
          category: categoryInput,
        });

        // Refresca la lista de servicios después de agregar uno nuevo
        setRefreshServices(!refreshServices);
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error);
      alert("Error al agregar el servicio");
    }
  };
  // console.log(serviceInput);
  // console.log(categoryInput);
  console.log(categoryServices);

  const handleDeleteService = async (serviceName) => {
    try {
      // Lógica para eliminar el servicio por su nombre
      await axios.post(`${VITE_BACKEND_URL}/services/delete`, {
        service: serviceName,
      });

      // Refresca la lista de servicios después de eliminar uno
      setRefreshServices(!refreshServices);
    } catch (error) {
      console.error("Error al borrar el servicio:", error);
      alert("Error al borrar el servicio");
    }
  };

  const handleCategoryInputChange = (event, newInputValue) => {
    setCategoryInput(newInputValue);
  };

  const handleServiceInputChange = (event, newInputValue) => {
    setServiceInput(newInputValue);
  };


  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loadingServices ? (
        <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
      ) : (
        <hr
          style={{
            marginBottom: "15px",
            border: "none",
            height: "2px",
            backgroundColor: "#2196f3",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "10px 0px 20px 0px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            width: sm ? "100%" : "50%",
            backgroundColor: "red",
            marginRight: sm ? "0px" : "5px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "lightgray",
          }}
        >
          Selecciona o agrega categorias o servicios.
        </span>
        {!sm && (
          <>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                width: "50%",
                marginLeft: "5px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "lightgray",
              }}
            >
              Ingresa un precio y la seña correspondiente.
            </span>
          </>
        )}
      </div>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: sm ? "" : "center",
          flexDirection: sm ? "column" : "row",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: sm ? "column" : "row",
            width: sm ? "100%" : "50%",
            marginRight: "5px",
          }}
        >
          <Autocomplete
            options={categoryList}
            sx={{
              width: "100%",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
            }}
            value={categoryInput}
            onInputChange={handleCategoryInputChange}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <TextField {...params} label="Categoría" />
            )}
          />

          <Autocomplete
            options={serviceList}
            sx={{
              width: "100%",

              margin: sm ? "10px 0px 0px 0px " : "0px 0px 0px 10px",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
            }}
            value={serviceInput}
            onInputChange={handleServiceInputChange}
            isOptionEqualToValue={(option, value) => true}
            renderInput={(params) => <TextField {...params} label="Servicio" />}
          />
        </div>
        {sm && (
          <span
            style={{
              padding: "10px",
              margin: "25px 0px 20px 0px",
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor: "lightgray",
              borderRadius: "5px",
            }}
          >
            Ingresa un precio y la seña correspondiente.
          </span>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: sm ? "column" : "row",
            width: sm ? "100%" : "50%",
            marginLeft: sm ? "0px" : "5px",
          }}
        >
          <TextField
            sx={{
              width: "100%",
            }}
            id="filled-number"
            label="Seña"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            sx={{
              width: "100%",

              margin: sm ? "10px 0px 0px 0px " : "0px 0px 0px 10px",
            }}
            id="filled-number"
            label="Precio"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </Box>
      <Button
        onClick={handleAddServiceCategory}
        variant="contained"
        sx={{
          display: "flex",
          alignSelf: "flex-end",
          height: "40px",
          width: "150px",
          fontFamily: "Jost, sans-serif",
          fontWeight: "bold",
        }}
      >
        Agregar
      </Button>
      <hr
        style={{
          width: "100%",
          border: "2px solid lightgray",
          borderRadius: "10px",
          margin: "20px 0px 20px 0px",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <div style={{ width: "100%", display: "flex" }}>
          <span style={{ width: "40%", fontWeight: "bold", fontSize: "18px" }}>
            Categorias y servicios
          </span>
          <hr />
          <span style={{ width: "30%", fontWeight: "bold", fontSize: "18px" }}>
            Precio
          </span>
          <hr />
          <span style={{ width: "30%", fontWeight: "bold", fontSize: "18px" }}>
            Seña
          </span>
        </div>
        <hr />
        {categoryServices.map((elem, index) => {
          return (
            <div key={index}>
              <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                {elem.category}
              </span>
              <hr />
              {elem.services.map((service, index) => {
                return (
                  <div style={{ display: "flex", width: "100%" }}>
                    <span style={{ width: "40%" }}>{service.name}</span>
                    <hr />
                    <span style={{ width: "30%" }}>${service.price}</span>
                    <hr />
                    <span style={{ width: "30%" }}>${service.sing}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "15px",
        }}
      >
        <div style={{ display: "flex" }}>
          <Button
            disabled={showEdit ? true : false}
            onClick={handleOpenDelete}
            color="error"
          >
            <DeleteRoundedIcon />
          </Button>
          <DeleteServicesModal
            categoryServices={categoryServices}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            setRefreshServices={setRefreshServices}
          />
        </div>
      </Box>
    </div>
  );
};

export default Services;
