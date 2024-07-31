import { useEffect, useState, useRef } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import formatHour from "../../functions/formatHour";
import "./turnsCartFooter.css";
import axios from "axios";

const VITE_MERCADO_PAGO_PUBLIC_KEY = import.meta.env
  .VITE_MERCADO_PAGO_PUBLIC_KEY;
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TurnsCartFooter = ({ turnsCart, setTurnsCart }) => {
  const [openCart, setOpenCart] = useState(false);
  const [currentTurnsNumber, setCurrentTurnsNumber] = useState({});
  const [preferenceId, setPreferenceId] = useState(null);
  const containerRef = useRef(null);

  initMercadoPago(VITE_MERCADO_PAGO_PUBLIC_KEY, {
    locale: "es-AR",
  });

  const handleOpenCart = () => {
    setOpenCart(true);
    // Añadir un nuevo estado al historial del navegador
    window.history.pushState({ openCart: true }, "");
  };

  const handleCloseCart = () => {
    setOpenCart(false);
    // Añadir un nuevo estado al historial del navegador
    window.history.pushState({ openCart: false }, "");
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

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop > 30) {
          setOpenCart(false);
        } else if (scrollTop < 30) {
          setOpenCart(true);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
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

  const handleBuy = async () => {
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/mercadopago/create_preference`,
        {
          arrayItems: turnsCart,
        }
      );
      setPreferenceId(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      ref={containerRef}
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
        <div className="extend-cart-btn" onClick={handleCloseCart}></div>
        {!openCart ? (
          <>
            <span>
              {turnsCart.length > 0
                ? `Turnos seleccionados: ${turnsCart.length}`
                : "Turnos seleccionados: 0"}
            </span>
            <button onClick={handleOpenCart}>Desplegar</button>
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
                  <div>
                    <button onClick={() => handleSubtract(turn)}>-</button>
                    <span>{turn.quantity || 1}</span>
                    <button onClick={() => handleAdd(turn)}>+</button>
                  </div>
                </div>
              );
            })}
            <div className="div-btns-pay-mp">
              <button onClick={handleBuy} className="btn-sing-pay">
                Señar/Agendar
              </button>
              {preferenceId && (
                <Wallet
                  initialization={{
                    preferenceId: preferenceId,
                    redirectMode: "self",
                  }}
                  // onReady={() => {}}
                  // onError={() => {}}
                  // onSubmit={() => {}}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default TurnsCartFooter;
