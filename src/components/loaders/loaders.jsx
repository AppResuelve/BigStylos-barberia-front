import mercadoPagoIcon from "../../assets/images/mercadopago.png";
import "./loaders.css";
const LoaderToBuy = ({ redirect }) => {
  console.log(redirect);
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
              <img src={mercadoPagoIcon} alt="mercado pago"  />
              <span className="span-redirect-mp">
                Redireccionando a mercado pago
              </span>
            </div>
          )}
        </div>
      </div>
      {redirect && <span>Compra segura</span>}
    </div>
  );
};

export { LoaderToBuy };
