import { useState } from "react";
import "./turnsCartFooter.css";
import formatHour from "../../functions/formatHour";

const TurnsCartFooter = ({ turnsCart, setTurnsCart }) => {
  const [openCart, setOpenCart] = useState(false);
  const [currentTurnsNumber, setCurrentTurnsNumber] = useState({});

  const handleOpenCart = () => {
    setOpenCart(true);
  };
  const handleCloseCart = () => {
    setOpenCart(false);
  };

  const handleAdd = (turn) => {
    if (currentTurnsNumber[turn.id] === turn.worker.length) return;
    setCurrentTurnsNumber((prevState) => {
      let copyState = { ...prevState };

      copyState[turn.id] = (copyState[turn.id] || 1) + 1;

      return copyState;
    });
  };

  const handleSubtract = (turn) => {
    if (!currentTurnsNumber[turn.id] || currentTurnsNumber[turn.id] <= 1)
      return;
    setCurrentTurnsNumber((prevState) => {
      let copyState = { ...prevState };

      copyState[turn.id] = copyState[turn.id] - 1;

      return copyState;
    });
  };

  console.log(turnsCart);
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
            <button onClick={handleOpenCart}>Continuar</button>
          </>
        ) : (
          turnsCart.map((turn, index) => {
            return (
              <div key={index} className="container-each-turn">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{turn.service.name}</span>
                  <span>
                    {`${turn.day}/${turn.month} a las ${formatHour(turn.ini)}`}
                  </span>
                </div>
                <div>
                  <button onClick={() => handleSubtract(turn)}>-</button>
                  <span>{currentTurnsNumber[turn.id] || 1}</span>
                  <button onClick={() => handleAdd(turn)}>+</button>
                  <button>Señar/Agendar</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default TurnsCartFooter;
