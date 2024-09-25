import Swal from "sweetalert2";
import { getCookie } from "../../helpers/cookies";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { useContext } from "react";
import "./ourServices.css";

const OurServices = () => {
  const { googleLogin, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  const handleReserveClick = () => {
    const isLoggedIn = getCookie("IDSESSION");
    if (!isLoggedIn) {
      Swal.fire({
        title: "Inicia sesión para reservar",
        showDenyButton: true,
        confirmButtonText: "Iniciar sesión",
        denyButtonText: "Más tarde",
      }).then((result) => {
        if (result.isConfirmed) {
          googleLogin();
        }
      });
    } else {
      // Navegar a la página de reservas si el usuario está logueado
      navigate("/turns");
    }
  };
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="container-ourservices">
      {/* mapear categorias y servicios para mostrar */}
      <section
        className="section-btn-reservar-ourservices"
        style={{
          height: md ? "135px" : "70px",
          borderRadius: "20px 20px 0px 0px",
          background: `linear-gradient(to bottom, lightgray, transparent)`,
        }}
      >
        <div
          className="container-btn-reservar-ourservices"
          style={{
            display: "flex",
            flexDirection: md ? "column" : "row",
          }}
        >
          <button
            onClick={handleReserveClick}
            className="btn-reservar-home"
            style={{ width: md ? "100%" : "calc(50% - 5px)" }}
          >
            Reservar turno
          </button>
          <div
            style={{
              position: "relative",
              width: !md ? "calc(50% - 5px)" : "100%",
            }}
          >
            <button
              id="myTurns"
              onClick={handleGoHome}
              className="btn-reservar-home"
              style={{ width: "100%" }}
            >
              Volver a inicio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default OurServices;
