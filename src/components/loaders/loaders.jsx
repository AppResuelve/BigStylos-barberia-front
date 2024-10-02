import mercadoPagoIcon from "../../assets/images/mercadopago.png";
import securePayIcon from "../../assets/icons/secure-pay.png";
import "./loaders.css";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { LinearProgress } from "@mui/material";
const { xs, sm, md, lg, xl } = useMediaQueryHook();

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

export {
  LoaderToBuy,
  LoaderUserReady,
  LoaderUserImgReady,
  LoaderPage,
  LoaderMapReady,
  LoaderLinearProgress,
};
