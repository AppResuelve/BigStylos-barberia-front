import mercadoPagoIcon from "../../assets/images/mercadopago.png";
import securePayIcon from "../../assets/icons/secure-pay.png";
import servicesIcon from "../../assets/icons/review.png";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { LinearProgress } from "@mui/material";
const { xs, sm, md, lg, xl } = useMediaQueryHook();
import "./loaders.css";

const LoaderToBuy = ({ redirect }) => {
  return (
    <div className="container-all-loadertobuy">
      <div
        className={
          redirect ? "container-loadertobuy-redirect" : "container-loadertobuy"
        }
      >
        <div className={redirect ? "loadertobuy-redirect" : "loadertobuy"}>
          {redirect && (
            <div>
              <img src={mercadoPagoIcon} alt="mercado pago" />
              <span className="span-redirect-mp">
                Redireccionando a mercado pago
              </span>
            </div>
          )}
        </div>
      </div>
      {redirect && (
        <div className="container-secure-pay">
          <img src={securePayIcon} alt="compra segura" />
          <span>Compra segura</span>
        </div>
      )}
    </div>
  );
};

const LoaderUserReady = () => {
  return (
    <div className="container-loaderuserready">
      <li className="dots-userready" id="dot-1"></li>
      <li className="dots-userready" id="dot-2"></li>
      <li className="dots-userready" id="dot-3"></li>
    </div>
  );
};

const LoaderUserImgReady = () => {
  return (
    <div className="container-loaderuserimgready">
      <li className="dots-userimgready" id="dot-1"></li>
      <li className="dots-userimgready" id="dot-2"></li>
      <li className="dots-userimgready" id="dot-3"></li>
    </div>
  );
};

const LoaderPage = () => {
  return (
    <div className="container-page">
      <div className="rings-container">
        <div id="rings-calendar-1"></div>
        <div id="rings-calendar-2"></div>
        <div className="container-loaderpage">
          <div className="folded-sheet-calendar"></div>
          <div className="loaderpage">
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
          </div>
        </div>
        <span>Tengoturno</span>
      </div>
    </div>
  );
};

const LoaderMapReady = () => {
  return (
    <div
      className="container-loadermapready"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <li className="dots-mapready" id="dot-1"></li>
      <li className="dots-mapready" id="dot-2"></li>
      <li className="dots-mapready" id="dot-3"></li>
    </div>
  );
};

const LoaderLinearProgress = ({ loadingServices }) => {
  return (
    <>
      <LinearProgress
        variant={!loadingServices ? "determinate" : "indeterminate"} // Establece el modo determinado
        value={!loadingServices ? 100 : null} // Establece el progreso al 100%
        sx={{
          height: !loadingServices ? "0px" : "4px",
          borderRadius: "5px",
          marginBottom: !loadingServices ? "17px" : "13px",
          bgcolor: "var(--bg-color)", // Fondo de la barra
          "& .MuiLinearProgress-bar": {
            backgroundColor: "var(--accent-color)", // Color de la barra de progreso
          },
        }}
      />
    </>
  );
};

import { useEffect, useState } from "react";

const LoaderServicesReady = ({ servicesReady }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (servicesReady) {
      setIsFading(true);
      // Esperar un poco antes de ocultar completamente el loader
      const timeout = setTimeout(() => {
        setIsFading(false);
      }, 200); // Aquí ajustas el tiempo que coincide con la transición en CSS
      return () => clearTimeout(timeout);
    }
  }, [servicesReady]);

  return (
    <div
      className={
        isFading
          ? "container-loaderservicesready fade-out"
          : "container-loaderservicesready"
      }
      style={{ display: servicesReady && !isFading ? "none" : "flex" }}
    >
      <img
        src={servicesIcon}
        alt="cargando servicios"
        style={{
          width: sm ? "120px" : "140px",
          height: sm ? "120px" : "140px",
          filter: "var(--filter-invert)",
        }}
      />
      <div className="container-dots-servicesready">
        <li className="dots-servicesready" id="dot-1"></li>
        <li className="dots-servicesready" id="dot-2"></li>
        <li className="dots-servicesready" id="dot-3"></li>
      </div>
    </div>
  );
};


export {
  LoaderToBuy,
  LoaderUserReady,
  LoaderUserImgReady,
  LoaderPage,
  LoaderMapReady,
  LoaderLinearProgress,
  LoaderServicesReady,
};
