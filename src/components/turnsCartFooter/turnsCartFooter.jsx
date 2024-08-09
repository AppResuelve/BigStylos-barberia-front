import { useEffect, useState, useRef } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import formatHour from "../../functions/formatHour";
import backIcon from "../../assets/icons/back.png";
import trashIcon from "../../assets/icons/trash.png";
import "./turnsCartFooter.css";
import axios from "axios";
import { LoaderToBuy } from "../loaders/loaders";
import { useNavigate } from "react-router-dom";

const VITE_MERCADO_PAGO_PUBLIC_KEY = import.meta.env
  .VITE_MERCADO_PAGO_PUBLIC_KEY;
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TurnsCartFooter = ({ turnsCart, setTurnsCart, setAuxCart }) => {
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const [urlInitPoint, setUrlInitPoint] = useState(null);
  const [loader, setLoader] = useState(false);

  initMercadoPago(VITE_MERCADO_PAGO_PUBLIC_KEY, {
    locale: "es-AR",
  });

  const handleToggleCart = () => {
    setOpenCart((prevOpenCart) => {
      const newOpenCart = !prevOpenCart;
      window.history.pushState({ openCart: newOpenCart }, "");
      return newOpenCart;
    });
  };

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

  const handleAdd = (turn) => {
    setTurnsCart((prevState) => {
      return prevState.map((t) => {
        if (t.id === turn.id) {
          if (t.quantity === t.worker.length) return t; // No incrementar si ya se alcanzó el límite
          return { ...t, quantity: (t.quantity || 0) + 1 };
        }
        return t;
      });
    });
  };

  const handleSubtract = (turn) => {
    setTurnsCart((prevState) => {
      return prevState.map((t) => {
        if (t.id === turn.id) {
          if (t.quantity <= 1) return t; // No decrementar si ya es 1 o menos
          return { ...t, quantity: t.quantity - 1 };
        }
        return t;
      });
    });
  };
  const handleDeleteTurn = (turn) => {
    setTurnsCart((prevState) => {
      return prevState.filter((t) => t.id !== turn.id);
    });
    setAuxCart((prevState) => {
      const { [turn.id]: _, ...rest } = prevState;
      return rest;
    });
  };

  const handleBuy = async () => {
    let cartWithSing = [];
    let cartNoSing = [];
    turnsCart.map((turn) => {
      if (turn.service.sing !== "") {
        cartWithSing.push(turn);
      } else {
        cartNoSing.push(turn);
      }
    });
    setLoader(true);
    if (cartWithSing.length > 0) {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/mercadopago/create_preference`,
          {
            arrayItems: turnsCart,
            // cartWithSing,
            // cartNoSing,
          }
        );
        setUrlInitPoint(response.data);
        setLoader(false);
        setTimeout(() => {
          window.location.href = response.data;
        }, 2500);
        // Redirigir después de establecer la URL de redirección
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    } else {
      try {
        const response = await axios.put(`${VITE_BACKEND_URL}/workdays/turn`, {
          arrayItems: cartNoSing,
        });
        setLoader(false);
        console.log(response);

        //si sale bien alerta con success turnos
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    }
  };

  console.log(loader);
  return (
    <div
      className={
        openCart
          ? "container-turnscartfooter-open"
          : "container-turnscartfooter"
      }
    >
      <div
        className={
          openCart
            ? "subcontainer-turnscartfooter-open"
            : "subcontainer-turnscartfooter"
        }
      >
        <div
          className="extend-cart-btn"
          onClick={handleToggleCart}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: openCart ? "center" : "",
          }}
        >
          <img
            src={backIcon}
            alt="expand"
            style={{
              rotate: openCart ? "-90deg" : "90deg",
            }}
          />
        </div>
        {!openCart ? (
          <>
            <span>
              {turnsCart.length > 0
                ? `Turnos seleccionados: ${turnsCart.length}`
                : "Turnos seleccionados: 0"}
            </span>
            <button onClick={handleToggleCart}>Desplegar</button>
          </>
        ) : (
          <>
            {turnsCart.map((turn, index) => {
              return (
                <div key={index} className="container-each-turn">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{turn.service.name}</span>
                    <span>
                      {`${turn.day}/${turn.month} a las ${formatHour(
                        turn.ini
                      )}`}
                    </span>
                  </div>
                  <div id="minor-plas">
                    {turn.quantity < 2 ? (
                      <button
                        id="deleteturn-button"
                        onClick={() => handleDeleteTurn(turn)}
                      >
                        <img src={trashIcon} alt="delete turno" />
                      </button>
                    ) : (
                      <button onClick={() => handleSubtract(turn)}>-</button>
                    )}
                    <span>{turn.quantity || 1}</span>
                    <button onClick={() => handleAdd(turn)}>+</button>
                  </div>
                </div>
              );
            })}
            <div className="div-btns-pay-mp">
              {loader ? (
                <LoaderToBuy redirect={false} />
              ) : urlInitPoint ? (
                <>
                  <LoaderToBuy redirect={true} />
                </>
              ) : (
                <button onClick={handleBuy} className="btn-sing-pay">
                  Agendar y Señar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default TurnsCartFooter;
