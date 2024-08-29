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

export { LoaderToBuy };
