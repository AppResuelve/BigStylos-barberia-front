import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Box, Button, Grid, Input } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinearProgress from "@mui/material/LinearProgress";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Services = ({
  services,
  refreshServices,
  setRefreshServices,
  loadingServices,
  setLoadingServices,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [newService, setNewService] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleKeyDown = (e) => {
    // Manejar el evento cuando se presiona Enter
    if (e.keyCode === 13) {
      e.preventDefault(); // Evitar que se agregue un salto de línea en el Input
      handleAddService();
    }
  };

  const handleAddService = async () => {
    try {
      if (newService !== "") {
        // Verifica si el nuevo servicio no está vacío
        await axios.post(`${VITE_BACKEND_URL}/services/create`, {
          service: [newService],
        });

        // Refresca la lista de servicios después de agregar uno nuevo
        setNewService("");
        setSearchValue("");
        setRefreshServices(!refreshServices);
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error);
      alert("Error al agregar el servicio");
    }
  };

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
      <Box
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          alignSelf: "end",
          marginBottom: "15px",
        }}
      >
        <Input
          type="text"
          value={newService}
          placeholder="Puedes buscar"
          onChange={(e) => {
            setNewService(e.target.value), setSearchValue(e.target.value);
          }}
          onKeyDown={handleKeyDown} // Manejar el evento onKeyDown
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: "20px",
            width: "60%",
            backgroundColor: darkMode.on ? "white" : "#d6d6d5",
            fontWeight: "bold",
            paddingLeft: "10px",
            borderRadius: "5px",
          }}
        />
        <Button
          onClick={handleAddService}
          variant="contained"
          style={{ width: "40%", borderRadius: "5px 5px 5px 0px" }}
        >
          <h4 style={{ fontFamily: "Jost, sans-serif" }}>Agregar</h4>
        </Button>
      </Box>
      <Grid
        container
        spacing={1}
        style={{
          width: "100%",
          display: "flex",
          overflow: "scroll",
          alignSelf: "end",
          maxHeight: "300px",
        }}
      >
        {services.length > 0 ? (
          services
            .filter((service) =>
              service[0].toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((element, index) => (
              <Grid
                item
                style={{
                  width: "100%",
                  display: "flex",
                  overflow: "auto",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                xs={12}
                sm={6}
                md={4}
                key={index}
              >
                <h3 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                  {element[0]}
                </h3>
                <Box style={{ display: "flex" }}>
                  <Button
                    onClick={() => handleDeleteService(element[0])}
                    style={{ color: "red", borderRadius: "50px" }}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </Box>
              </Grid>
            ))
        ) : (
          <Grid
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingTop: "15px",
            }}
          >
            <h2>
              {loadingServices
                ? "Cargando servicios"
                : "No hay servicios todavía"}
            </h2>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Services;
