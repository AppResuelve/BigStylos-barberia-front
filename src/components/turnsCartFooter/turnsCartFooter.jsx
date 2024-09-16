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
import axios from "axios";
import "./turnsCartFooter.css";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TurnsCartFooter = () => {
  const { turnsCart, setTurnsCart, setAuxCart, setDayIsSelected } =
    useContext(CartContext);
  const { setNewTurnNotification } = useContext(LoadAndRefreshContext);
  const [openCart, setOpenCart] = useState(false);
  const [urlInitPoint, setUrlInitPoint] = useState(null);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0); // Estado para el total del carrito

  useEffect(() => {
    // Calcular el total del carrito basado en el quantity de cada turno
    const totalAmount = turnsCart.reduce((acc, turn) => {
      const quantity = turn.quantity || 1;
      const price = turn.service.sing || 0; // Suponiendo que 'sing' es el precio
      return acc + quantity * price;
    }, 0);

    setTotal(totalAmount);
  }, [turnsCart]);

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
  if (turnsCart.length === 0) {
    return null; // No renderiza nada
  }

  const handleToggleCart = () => {
    setOpenCart((prevOpenCart) => {
      const newOpenCart = !prevOpenCart;
      window.history.pushState({ openCart: newOpenCart }, "");
      return newOpenCart;
    });
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

  const handleDeleteTurn = (turn) => {
    setTurnsCart((prevState) => {
      const updatedCart = prevState.filter((t) => t.id !== turn.id);
      // Si el carrito está vacío después de eliminar el turno, cerrar el carrito
      if (updatedCart.length === 0) {
        setOpenCart(false);
      }
      return updatedCart;
    });
    setAuxCart((prevState) => {
      const { [turn.id]: _, ...rest } = prevState;
      return rest;
    });
  };

  const handleBuy = async () => {
    let cartWithSing = [];
    let cartNoSing = [];
    setLoader(true);
    turnsCart.map((turn) => {
      if (turn.service.sing != 0) {
        cartWithSing.push(turn);
      } else {
        cartNoSing.push(turn);
      }
    });
    if (cartWithSing.length > 0) {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/mercadopago/create_preference`,
          {
            arrayItems: turnsCart,
            cartWithSing,
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
          arrayItems: cartNoSing,
        });
        setLoader(false);
        setTurnsCart([]);
        setAuxCart({});
        setDayIsSelected([]);
        toastAlert(
          cartNoSing.length > 1
            ? "Los turnos han sidos agendados con éxito!"
            : "El turno ha sido agendado con éxito!",
          "success"
        );
        setNewTurnNotification((prevState) => {
          return prevState + 1;
        });
      } catch (error) {
        setLoader(false);
        toastAlert(
          cartNoSing.length > 1
            ? "Error al agendar los turnos."
            : "Error al agendar el turno",
          "error"
        );
        console.log(error);
      }
    }
  };

  return (
    <>
      {openCart && (
        <div
          className="backdrop-turnscartfooter"
          onClick={handleToggleCart}
        ></div>
      )}
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
              <button onClick={handleToggleCart}>Mostrar</button>
            </>
          ) : (
            <>
              {turnsCart.map((turn, index) => {
                return (
                  <div key={index} className="container-each-turn">
                    <div className="sub-container1-each-turn">
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
                          <button onClick={() => handleSubtract(turn)}>
                            -
                          </button>
                        )}
                        <span>{turn.quantity || 1}</span>
                        <button onClick={() => handleAdd(turn)}>+</button>
                      </div>
                    </div>
                    {turn.service.sing != 0 && (
                      <>
                        <hr />
                        <div className="sub-container2-each-turn">
                          <img src={hasSingIcon} alt="requiere seña" />
                          <span>${turn.service.sing}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {total !== 0 && (
                <div className="div-container-totalsing-turns">
                  <hr className="hr-totalsing-turns" />
                  <span>Total a señar: ${total}</span>
                </div>
              )}

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
    </>
  );
};
export default TurnsCartFooter;
