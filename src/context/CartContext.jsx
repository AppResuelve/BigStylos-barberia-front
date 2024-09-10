import { createContext, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [turnsCart, setTurnsCart] = useState([]);
  const [auxCart, setAuxCart] = useState({});
  const [dayIsSelected, setDayIsSelected] = useState([]);

  const data = {
    turnsCart,
    setTurnsCart,
    auxCart,
    setAuxCart,
    dayIsSelected,
    setDayIsSelected,
  };
  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};
export { CartProvider };
export default CartContext;
