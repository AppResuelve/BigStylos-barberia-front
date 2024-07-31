import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import formatHour from "../../functions/formatHour";
import "./turnsCartFooter.css";
import axios from "axios";

const VITE_MERCADO_PAGO_PUBLIC_KEY = import.meta.env
  .VITE_MERCADO_PAGO_PUBLIC_KEY;

const TurnsCartFooter = ({ turnsCart, setTurnsCart }) => {
  const [openCart, setOpenCart] = useState(false);
  const [currentTurnsNumber, setCurrentTurnsNumber] = useState({});
  const [preferenceId, setPreferenceId] = useState(null);
  initMercadoPago({ VITE_MERCADO_PAGO_PUBLIC_KEY }),
    {
      locale: "es-AR",
    };

  const handleOpenCart = () => {
    setOpenCart(true);
  };
  const handleCloseCart = () => {
    setOpenCart(false);
  };

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

  const createPreference = async () => {
    
    try {
      response = await axios.post(
        "http://localhost:3000/create_preference",
        {

        }
      );
      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
    }
  };

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
        <div className="extend-cart-btn"></div>
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
          <section>
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
            <button onClick={handleBuy}>Señar/Agendar</button>
            {preferenceId && (
              <wallet
                initialization={{
                  preferenceId: preferenceId,
                  redirectMode: "self",
                }}
                // onReady={() => {}}
                // onError={() => {}}
                // onSubmit={() => {}}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
};
export default TurnsCartFooter;
