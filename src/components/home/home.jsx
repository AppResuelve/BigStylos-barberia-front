import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import fondoCentral from "../../assets/images/fondo-peluqueria-1.avif";
import { Button } from "@mui/material";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home = ({ user, darkMode }) => {
  const [homeImages, setHomeImages] = useState([]); //images del home

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/images`);
        const { data } = response;
        console.log(data);
        setHomeImages(data);
        //  setLoading(false);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };

    fetchImages();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        paddingTop: "70px",
        backgroundColor: darkMode ? "#252627" : "white",
      }}
    >
      <img
        src={homeImages[0]}
        alt="nombre del lugar"
        style={{
          marginTop: "20px",
          width: "400px",
          height: "400px",
          objectFit: "cover",
          borderRadius: "200px",
          boxShadow: "0px 43px 51px -23px rgba(0,0,0,0.57)", // Propiedades de la sombra
        }}
      />
      <NavLink to="/turns">
        <Button
          variant="contained"
          style={{
            marginBottom: "150px",
            borderRadius: "50px",
            height: "60px",
            fontFamily: "Jost, sans-serif",
            fontSize: "23px",
            backgroundColor: darkMode ? "white" : "#252627",
            color: darkMode ? "#252627" : "white",
          }}
        >
          Reservar
        </Button>
      </NavLink>
    </div>
  );
};
export default Home;
