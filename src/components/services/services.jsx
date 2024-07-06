import { useEffect, useState, useContext } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { DarkModeContext } from "../../App";
import { convertToCategoryArray } from "../../helpers/convertCategoryService";
import { Box, Button, TextField } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Autocomplete from "@mui/material/Autocomplete";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import EditServicesModal from "./editServicesModal";
import axios from "axios";

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
  const [categoryList, setCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [categoryServices, setCategoryServices] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editableCatSer, setEditableCatSer] = useState([]);

  // Estado para los inputs
  const [inputs, setInputs] = useState({
    category: "",
    service: "",
    price: 0,
    sing: 0,
  });

  useEffect(() => {
    if (services) {
      const categoryArray = convertToCategoryArray(services);

      const extractedCategories = Object.keys(services);
      const extractedServices = [];

      for (const category of extractedCategories) {
        extractedServices.push(...Object.keys(services[category]));
      }
      setCategoryServices(categoryArray); //renderizar
      setEditableCatSer(categoryArray); //copia para editar
      setCategoryList(extractedCategories); //array categorias
      setServiceList(extractedServices); //array servicios
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
      const { service, category, price, sing } = inputs;
      if (service !== "" && category !== "") {
        // Verifica si el nuevo servicio no está vacío
        await axios.post(`${VITE_BACKEND_URL}/services/create`, {
          service,
          category,
          price,
          sing,
        });

        // Refresca la lista de servicios después de agregar uno nuevo
        setRefreshServices(!refreshServices);
        // Limpiar los inputs
        setInputs({
          category: "",
          service: "",
          price: "",
          sing: "",
        });
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error);
      alert("Error al agregar el servicio");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "price" || name === "sing") {
      if (value >= 0) {
        setInputs({
          ...inputs,
          [name]: value,
        });
      }
    } else {
      setInputs({
        ...inputs,
        [name]: value,
      });
    }
  };

  const handleCategoryInputChange = (event, newInputValue) => {
    setInputs({
      ...inputs,
      category: newInputValue,
    });
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  console.log(inputs);
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
            value={inputs.category}
            onInputChange={handleCategoryInputChange}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <TextField {...params} label="Categoría" />
            )}
          />
          <TextField
            sx={{
              width: "100%",
              margin: sm ? "10px 0px 0px 0px " : "0px 0px 0px 10px",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
            }}
            id="filled-text"
            label="Servicio"
            type="text"
            name="service"
            value={inputs.service}
            onChange={handleInputChange}
            placeholder="ej: corte de pelo"
            InputLabelProps={{
              shrink: true,
            }}
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
            label="Precio"
            type="number"
            name="price"
            value={inputs.price}
            onChange={handleInputChange}
            InputProps={{ inputProps: { min: 0 } }}
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
            label="Seña"
            type="number"
            name="sing"
            value={inputs.sing}
            onChange={handleInputChange}
            InputProps={{ inputProps: { min: 0 } }}
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
                  <div style={{ display: "flex", width: "100%" }} key={index}>
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
      <div
        style={{
          display: "flex",
          marginTop: "15px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          disabled={showEdit ? true : false}
          onClick={handleOpenDelete}
          sx={{ fontFamily: "Jost,sans serif" }}
        >
          Edición
          <CreateRoundedIcon />
        </Button>
        <EditServicesModal
          categoryServices={categoryServices}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          setRefreshServices={setRefreshServices}
          editableCatSer={editableCatSer}
          setEditableCatSer={setEditableCatSer}
        />
      </div>
    </div>
  );
};

export default Services;
