import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Grid, Input } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Services = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [sendAdd, setSendAdd] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services`);
        const { data } = response;
        setServices(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchData();
  }, [sendAdd]);

  const handleAddService = async () => {
    try {
      if (newService !== "") {
        // Verifica si el nuevo servicio no está vacío
        await axios.post(`${VITE_BACKEND_URL}/services/create`, {
          service: newService,
        });

        // Refresca la lista de servicios después de agregar uno nuevo
        setNewService("");
        setSendAdd(!sendAdd);
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error);
      alert("Error al agregar el servicio");
    }
  };

  const deleteHandler = async (serviceName) => {
    try {
      // Lógica para eliminar el servicio por su nombre
      await axios.delete(`${VITE_BACKEND_URL}/services/delete`, {
        data: { service: serviceName },
      });

      // Refresca la lista de servicios después de eliminar uno
      setSendAdd(!sendAdd);
    } catch (error) {
      console.error("Error al borrar el servicio:", error);
      alert("Error al borrar el servicio");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
    >
     <hr
        style={{
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      <Box
        style={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          alignSelf: "end",
          marginBottom: "15px",
        }}
      >
        <Input
          type="text"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: "20px",
            width: "60%",
          }}
        />
        <Button
          onClick={handleAddService}
          variant="contained"
          style={{ width: "40%",borderRadius:"50px" }}
        >
          <h4 style={{ fontFamily: "Jost, sans-serif" }}>Agregar</h4>
        </Button>
      </Box>
      <Grid container spacing={2}>
        {services.length > 0 &&
          services.map((element, index) => (
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              xs={6}
              md={3}
              key={index}
            >
              <h2>{element}</h2>
              <Box style={{ display: "flex" }}>
                <Button
                  onClick={() => deleteHandler(element)}
                  style={{ color: "red", borderRadius: "50px" }}
                >
                  <DeleteOutlineIcon />
                </Button>
                <hr />
              </Box>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default Services;
