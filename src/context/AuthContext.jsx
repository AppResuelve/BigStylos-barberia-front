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
  const [userIsReady, setUserIsReady] = useState(false);
  const [refreshStatusSession, setRefreshStatusSession] = useState(false);
  const [isOpenUserPanel, setIsOpenUserPanel] = useState(false);
  const [openSection, setOpenSection] = useState({
    telefono: false,
    turnos: false,
  });
  const [dataErrorPage, setDataErrorPage] = useState({
    status: 404,
    text: "No hemos encontrado la dirección que estás buscando.",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticateUsers();
        if (response.auth) {
          setUserData(response.user);
          setUserIsReady(true);
          setCookie("IDSESSION", response.user.email, 360);
        } else {
          setUserData(false);
          setUserIsReady(true);
        }
      } catch (error) {
        setUserIsReady(true);
        setUserData(false);
        console.log("Error en authenticateUsers", error);
      }
    };

    fetchData();
  }, [refreshStatusSession]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setUserIsReady(false);
      const response = await axios.post(
        `${VITE_BACKEND_URL}/users/createGoogle`,
        { code: codeResponse.code }
      );
      setCookie("IDSESSION", response.data.email, 360);
      setUserData(response.data);
      setUserIsReady(true);
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
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Aquí manejas el número de teléfono ingresado
            try {
              const phoneNumber = result.value;
              const res = await axios.put(`${VITE_BACKEND_URL}/users/update`, {
                email: response.data.email,
                newPhoneNumber: phoneNumber,
              });
              toastAlert("Telefono guardado exitosamente!", "success");
            } catch (error) {
              toastAlert("Error al guardar el numero de teléfono.", "error");
              console.error("Error al cambiar el numero de teléfono:", error);
            }
          }
        });
      }
    },
    flow: "auth-code",
    onNonOAuthError: () => setUserIsReady(true),
    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

  const data = {
    userData,
    setUserData,
    isOpenUserPanel,
    setIsOpenUserPanel,
    openSection,
    setOpenSection,
    setRefreshStatusSession,
    googleLogin,
    userIsReady,
    setUserIsReady,
    dataErrorPage,
    setDataErrorPage,
  };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export default AuthContext;
