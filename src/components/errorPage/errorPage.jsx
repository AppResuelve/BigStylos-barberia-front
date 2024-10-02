import { useContext, useEffect } from "react";
import ThemeContext from "../../context/ThemeContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import toHome from "../../assets/icons/home.png";
import imgFondoError from "../../assets/images/mano-error.png";
import { NavLink, useLocation } from "react-router-dom";
import "./errorPage.css";
import AuthContext from "../../context/AuthContext";

const ErrorPage = () => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  const { darkMode } = useContext(ThemeContext);
  const { dataErrorPage,setDataErrorPage } = useContext(AuthContext);
  console.log(dataErrorPage);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/denied-access") {
      setDataErrorPage({
        status: "401",
        text: "No tienes permiso para acceder a esta dirección.",
      });
    }
  },[])
  return (
    <div
      className="container-errorpage"
      style={{ justifyContent: sm ? "flex-end" : "space-around" }}
    >
      <img className="img-errorpage" src={imgFondoError} />
      <img id="img-errorpage2" src={imgFondoError} />
      <div
        style={{
          width: "100%",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: "1",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "var(--text-color)",
            zIndex: "2",
          }}
        >
          <h1 style={{ fontSize: "50px" }}>Error {dataErrorPage.status}</h1>
          <h2>{dataErrorPage.text}</h2>
        </div>
        <NavLink to="/">
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
              backgroundColor: "var(--bg-color-secondary)",
              padding: "40px",
              width: sm ? "80px" : "150px",
              height: sm ? "80px" : "150px",
              borderRadius: "50%",
              cursor: "pointer",
              background:
                "linear-gradient(145deg, var(--bg-color-secondary), var(--bg-color))",
              boxShadow:
                "10px 10px 37px var(--bg-color-secondary),-30px -30px 57px var(--bg-color)",
            }}
          >
            <img
              src={toHome}
              style={{
                filter: darkMode.on && "invert(.7)",
                height: sm ? "45px" : "70px",
                width: sm ? "45px" : "70px",
              }}
            />
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default ErrorPage;
