import { useContext, useEffect, useState } from "react";
import CartContext from "../../context/CartContext";
import formatHour from "../../functions/formatHour";
import backIcon from "../../assets/icons/back.png";
import trashIcon from "../../assets/icons/trash.png";
import hasSingIcon from "../../assets/icons/dollar.png";
import { LoaderToBuy } from "../loaders/loaders";
import { setCookie } from "../../helpers/cookies";
import { setLocalStorage } from "../../helpers/localStorage";
import toastAlert from "../../helpers/alertFunction";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import axios from "axios";
import "./turnsCartFooter.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TurnsCartFooter = () => {
  const { turnsCart, setTurnsCart, setAuxCart, setDayIsSelected } =
    useContext(CartContext);
  const { setNewTurnNotification } = useContext(LoadAndRefreshContext);
  const [openCart, setOpenCart] = useState(true);
  const [urlInitPoint, setUrlInitPoint] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    return () => {
      setUrlInitPoint(null);
    };
  }, []);

  useEffect(() => {
    // Manejar el evento de popstate
    const handlePopState = (event) => {
      if (event.state && event.state.openCart !== undefined) {
        setOpenCart(event.state.openCart);
      } else {
        setOpenCart(false);
      }
    };

    // Escuchar el evento popstate
    window.addEventListener("popstate", handlePopState);
    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Si no hay turnos en el carrito, no renderizar nada
  if (Object.keys(turnsCart).length === 0) {
    return null; // No renderiza nada
  }

  const handleToggleCart = () => {
    setOpenCart((prevOpenCart) => {
      const newOpenCart = !prevOpenCart;
      window.history.pushState({ openCart: newOpenCart }, "");
      return newOpenCart;
    });
  };

  const handleAdd = () => {
    setTurnsCart((prevState) => {
      if (prevState.quantity === prevState.worker.length) return prevState; // No incrementar si ya se alcanzó el límite
      return { ...prevState, quantity: (prevState.quantity || 0) + 1 };
    });
  };

  const handleSubtract = () => {
    setTurnsCart((prevState) => {
      if (prevState.quantity <= 1) return prevState; // No decrementar si ya es 1 o menos
      return { ...prevState, quantity: prevState.quantity - 1 };
    });
  };

  const handleDeleteTurn = () => {
    setTurnsCart({});
    setOpenCart(false);
  };

  const handleBuy = async () => {
    setLoader(true);
    if (turnsCart.service.sing != 0) {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/mercadopago/create_preference`,
          {
            arrayItems: [turnsCart],
            cartWithSing: [turnsCart],
          }
        );
        setUrlInitPoint(response.data.init_point);
        setLocalStorage("CART_ID", response.data.turns);
        setCookie("PREFERENCE_ID", response.data.preference_id, 4);
        setLoader(false);
        setTimeout(() => {
          window.location.href = response.data.init_point;
        }, 3000);
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    } else {
      try {
        const response = await axios.put(`${VITE_BACKEND_URL}/workdays/turn`, {
          arrayItems: [turnsCart],
        });
        setLoader(false);
        setTurnsCart({});
        setDayIsSelected([]);
        toastAlert("El turno ha sido agendado con éxito!", "success");
        setNewTurnNotification(true);
        setCookie("NEWTURN-NOTIFICATION", true, 300);
      } catch (error) {
        setLoader(false);
        toastAlert("Error al agendar el turno", "error");
        console.log(error);
      }
    }
  };

  return (
    <>
      {/* {openCart && (
        <div
          className="backdrop-turnscartfooter"
          onClick={handleToggleCart}
        ></div>
      )} */}
      <div className={"container-turnscartfooter-open"}>
        <div className={"subcontainer-turnscartfooter-open"}>
          <div className="container-each-turn">
            <div className="sub-container1-each-turn">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{turnsCart.service.name}</span>
                <span>
                  {`${turnsCart.day}/${turnsCart.month} a las ${formatHour(
                    turnsCart.ini
                  )}`}
                </span>
              </div>
              <div id="minor-plas">
                {turnsCart.quantity < 2 ? (
                  <button id="deleteturn-button" onClick={handleDeleteTurn}>
                    <img src={trashIcon} alt="delete turno" />
                  </button>
                ) : (
                  <button onClick={handleSubtract}>-</button>
                )}
                <span>{turnsCart.quantity || 1}</span>
                <button
                  className="button-add-worker-tcf"
                  onClick={handleAdd}
                  disabled={turnsCart.worker.length === turnsCart.quantity}
                >
                  +
                </button>
              </div>
            </div>
            {turnsCart.service.sing != 0 && (
              <>
                <div className="sub-container2-each-turn">
                  <img src={hasSingIcon} alt="requiere seña" />
                  <span>Total: ${turnsCart.service.sing * turnsCart.quantity}</span>
                </div>
              </>
            )}
          </div>
          <div className="div-btns-pay-mp">
            {loader ? (
              <LoaderToBuy redirect={false} />
            ) : urlInitPoint ? (
              <LoaderToBuy redirect={true} />
            ) : (
              <button onClick={handleBuy} className="btn-sing-pay">
                {turnsCart.service.sing != 0 ? "Agendar y señar" : "Agendar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default TurnsCartFooter;
