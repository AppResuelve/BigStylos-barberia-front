import { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import AuthContext from "../../context/AuthContext";
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
import Swal from "sweetalert2";
import axios from "axios";
import "./turnsCartFooter.css";
import InputTel from "../inputTel/inputTel";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TurnsCartFooter = () => {
  const { turnsCart, setTurnsCart, setAuxCart, setDayIsSelected } =
    useContext(CartContext);
  const { setNewTurnNotification } = useContext(LoadAndRefreshContext);
  const {
    userData,
    setUserData,
    newPhoneNumber,
    setNewPhoneNumber,
    inputTelError,
    setInputTelError,
  } = useContext(AuthContext);
  const [openCart, setOpenCart] = useState(true);
  const [urlInitPoint, setUrlInitPoint] = useState(null);
  const [loader, setLoader] = useState(false);
  // Crear referencias para newPhoneNumber e inputTelError
  const phoneNumberRef = useRef(newPhoneNumber);
  const inputTelErrorRef = useRef(inputTelError);

  useEffect(() => {
    return () => {
      setUrlInitPoint(null);
    };
  }, []);

  // useEffect(() => {
  //   // Manejar el evento de popstate
  //   const handlePopState = (event) => {
  //     if (event.state && event.state.openCart !== undefined) {
  //       setOpenCart(event.state.openCart);
  //     } else {
  //       setOpenCart(false);
  //     }
  //   };

  //   // Escuchar el evento popstate
  //   window.addEventListener("popstate", handlePopState);
  //   // Limpiar el evento al desmontar el componente
  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, []);

  // // Si no hay turnos en el carrito, no renderizar nada
  // if (Object.keys(turnsCart).length === 0) {
  //   return null; // No renderiza nada
  // }

  // const handleToggleCart = () => {
  //   setOpenCart((prevOpenCart) => {
  //     const newOpenCart = !prevOpenCart;
  //     window.history.pushState({ openCart: newOpenCart }, "");
  //     return newOpenCart;
  //   });
  // };

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
  console.log(turnsCart);

  const handleBuy = async () => {
    let formattedTurn = { ...turnsCart };
    // let userConfirmed = true; // Variable para confirmar si se ingresó un nombre válido
    let phoneConfirmed = true; // Variable para confirmar si se ingresó un telefono válido
    // if (userData.worker || userData.admin) {
    //   const { isConfirmed, value } = await Swal.fire({
    //     title: "Ingresa el nombre de tu cliente.",
    //     input: "text", // Cambiado a "text" para nombre
    //     inputPlaceholder: "Ej: Esteban Quito.",
    //     inputAttributes: {
    //       maxlength: 30, // Ajuste de longitud para un nombre
    //       pattern: "^[a-zA-ZÀ-ÿ\\s]{1,30}$", // Validación de letras y espacios
    //       required: true, // Campo obligatorio
    //     },
    //     showConfirmButton: true,
    //     showDenyButton: true,
    //     confirmButtonText: "Agendar",
    //     denyButtonText: "Cancelar",
    //     reverseButtons: true,
    //     backdrop: `rgba(0,0,0,0.8)`,
    //     customClass: {
    //       popup: "custom-swal-modal",
    //       actions: "swal2-actions",
    //       htmlContainer: "custom-swal-body",
    //       confirmButton: "custom-confirm-button",
    //       denyButton: "custom-deny-button",
    //     },
    //     preConfirm: (value) => {
    //       if (!value) {
    //         Swal.showValidationMessage("Por favor, ingresa un nombre.");
    //       } else if (!/^[a-zA-ZÀ-ÿ\s]{1,30}$/.test(value)) {
    //         Swal.showValidationMessage("El nombre ingresado no es válido.");
    //       } else {
    //         return value; // Devuelve el nombre si es válido
    //       }
    //     },
    //     allowOutsideClick: false, // Evita cerrar el modal al hacer clic fuera de él
    //   });

    //   if (isConfirmed) {
    //     formattedTurn.user = value;
    //   } else {
    //     userConfirmed = false; // El usuario no confirmó o canceló el modal
    //   }
    // }
    // if (!userConfirmed) return; // Si no se confirmó el nombre, detener el proceso
    if (userData.phone == "") {
      const { isConfirmed, value } = await Swal.fire({
        title: "Necesitamos tu número de teléfono por única vez.",
        html: `
            <div id="phone-input-container"></div>
            <div id="phone-input-p-container">
              <p class="text-p-swal">Para qué necesitamos tú número?</p>
              <p>⏰ Para enviarte recordatorios.</p>
              <p>🔄️ Para avisarte de algún cambio en tús turnos.</p>
            </div>
          `,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Agendar",
        denyButtonText: "Cancelar",
        focusConfirm: true,
        reverseButtons: true,
        backdrop: `rgba(0,0,0,0.8)`,
        customClass: {
          popup: "custom-swal-modal",
          // actions: "swal2-actions",
          htmlContainer: "custom-swal-body",
          confirmButton: "custom-confirm-button",
          denyButton: "custom-deny-button",
        },
        didOpen: () => {
          const div = document.getElementById("phone-input-container");
          ReactDOM.render(
            <InputTel
              newPhoneNumber={newPhoneNumber}
              setNewPhoneNumber={(value) => {
                setNewPhoneNumber(value);
                phoneNumberRef.current = value; // Guardar en referencia
              }}
              setInputTelError={(error) => {
                setInputTelError(error);
                inputTelErrorRef.current = error; // Actualiza la referencia
              }}
            />,
            div
          );
        },
        preConfirm: () => {
          const currentPhoneNumber = phoneNumberRef.current; // Obtiene el valor actual de la referencia
          const currentInputTelError = inputTelErrorRef.current;

          if (currentPhoneNumber === "" || currentInputTelError !== "") {
            Swal.showValidationMessage("El número ingresado no es válido.");
            return false;
          } else {
            return currentPhoneNumber; // Devuelve el número si es válido
          }
        },
        allowOutsideClick: false,
      });
      if (isConfirmed) {
        // Aquí manejas el número de teléfono ingresado
        try {
          const res = await axios.put(`${VITE_BACKEND_URL}/users/update`, {
            email: userData.email,
            newPhoneNumber: value,
          });
          setUserData(res.data);
          toastAlert("Telefono guardado exitosamente!", "success");
        } catch (error) {
          toastAlert("Error al guardar el numero de teléfono.", "error");
          console.error("Error al cambiar el numero de teléfono:", error);
        }
      } else {
        phoneConfirmed = false;
      }
    }
    if (!phoneConfirmed) return;
    setLoader(true); // Solo activar el loader si se confirmó
    if (formattedTurn.service.sing != 0) {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/mercadopago/create_preference`,
          {
            arrayItems: [formattedTurn],
            cartWithSing: [formattedTurn],
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
          arrayItems: [formattedTurn],
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
                  <span>
                    Total: ${turnsCart.service.sing * turnsCart.quantity}
                  </span>
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
