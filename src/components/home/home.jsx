import { NavLink } from "react-router-dom";
import "./home.css";
import fondoCentral from "../../assets/images/fondo-peluqueria-1.avif";
import { Button } from "@mui/material";

const Home = ({user}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        paddingTop: "70px",
      }}
    >
      <img
        src={fondoCentral}
        alt="nombre del lugar"
        style={{
          marginTop: "20px",
          width: "400px",
          height: "400px",
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
            backgroundColor: "black",
          }}
        >
          Reservar
        </Button>
      </NavLink>
    </div>
  );
};
export default Home;
