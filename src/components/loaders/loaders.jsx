import mercadoPagoIcon from "../../assets/images/mercadopago.png";
import securePayIcon from "../../assets/icons/secure-pay.png";
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

export { LoaderToBuy, LoaderUserReady, LoaderPage };
