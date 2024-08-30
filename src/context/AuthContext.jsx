import { createContext, useEffect, useState } from "react";
import { setCookie } from "../helpers/cookies";
import authenticateUsers from "../helpers/authenticateUsers";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Swal from "sweetalert2";
import toastAlert from "../helpers/alertFunction";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(1);
  const [refreshStatusSession, setRefreshStatusSession] = useState(false);
  const [isOpenUserPanel, setIsOpenUserPanel] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/users/createGoogle`,
        { code: codeResponse.code }
      );
      setCookie("IDSESSION", response.data.email, 360);
      setUserData(response.data);
      setRefreshStatusSession((prev) => {
        const prevStatusSession = prev;
        return !prevStatusSession;
      });
      if (response.data.phone === "") {
        Swal.fire({
          title: "Necesitamos tu número de teléfono por única vez.",
          input: "tel", // Usamos 'tel' para indicar que es un campo para números telefónicos
          inputPlaceholder: "Ingresa tu número de teléfono",
          inputAttributes: {
            maxlength: 15, // Opcional: limitar la longitud del número de teléfono
            pattern: "[0-9]{10,15}", // Validación básica de números (mínimo 10 dígitos)
            required: true, // Campo obligatorio
          },
          confirmButtonText: "Guardar",
          preConfirm: (value) => {
            if (!value) {
              Swal.showValidationMessage(
                "Por favor, ingresa un número de teléfono"
              );
            } else if (!/^\d{10,15}$/.test(value)) {
              // Validación personalizada para solo permitir dígitos
              Swal.showValidationMessage("El número ingresado no es válido");
            } else {
              return value; // Devuelve el número si es válido
            }
          },
          allowOutsideClick: false, // Evita cerrar el modal al hacer clic fuera de él
        }).then((result) => {
          if (result.isConfirmed) {
            // Aquí manejas el número de teléfono ingresado
            const phoneNumber = result.value;
            toastAlert(`Tú número ha sido guardado!`, "success");

           
            // Puedes enviar este número al servidor o guardarlo en el estado de tu aplicación
          }
        });
      }
    },
    flow: "auth-code",
    onError: (errorResponse) => console.log(errorResponse),
  });

  useEffect(() => {
    authenticateUsers()
      .then((response) => {
        if (response.auth) {
          setUserData(response.user);
          setCookie("IDSESSION", response.user.email, 360);
        } else {
          setUserData(false);
        }
      })
      .catch((error) => {
        setUserData(false);
        console.log(error);
      });
  }, [refreshStatusSession]);

  const data = {
    userData,
    setUserData,
    isOpenUserPanel,
    setIsOpenUserPanel,
    setRefreshStatusSession,
    googleLogin,
  };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export default AuthContext;
