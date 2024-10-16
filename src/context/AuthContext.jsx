import { createContext, useEffect, useState } from "react";
import { setCookie } from "../helpers/cookies";
import authenticateUsers from "../helpers/authenticateUsers";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Swal from "sweetalert2";
import toastAlert from "../helpers/alertFunction";
import ReactDOM from "react-dom";
import InputTel from "../components/inputTel/inputTel";
import { useRef } from "react";

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
  const [newPhoneNumber, setNewPhoneNumber] = useState(userData?.phone ?? "");
  const [inputTelError, setInputTelError] = useState("");
  // Crear referencias para newPhoneNumber e inputTelError
  const phoneNumberRef = useRef(newPhoneNumber);
  const inputTelErrorRef = useRef(inputTelError);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticateUsers();
        if (response.auth) {
          setUserData(response.user);
          setUserIsReady(true);
          setCookie("IDSESSION", response.user.email, 10080);
        } else {
          setUserData(false);
          setUserIsReady(true);
        }
      } catch (error) {
        setUserIsReady(true);
        setUserData(false);
        console.error("Error en authenticateUsers", error);
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
          html: `
        <div id="phone-input-container"></div>
        <div id="phone-input-p-container">
        <p class="text-muted">Para qué necesitamos tú número?</p>
        <p class="text-muted">✅ Para enviarte recordatorios.</p>
        <p class="text-muted">✅ Para avisarte de algún cambio en tús turnos.</p>
        </div>
      `,
          customClass: {
            popup: "custom-swal-modal",
            htmlContainer: "custom-swal-body",
            confirmButton: "custom-confirm-button",
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
          confirmButtonText: "Guardar",
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
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Aquí manejas el número de teléfono ingresado
            try {
              const phoneNumber = result.value;
              const res = await axios.put(`${VITE_BACKEND_URL}/users/update`, {
                email: response.data.email,
                newPhoneNumber: phoneNumber,
              });
              setUserData(res.data);
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
    newPhoneNumber,
    setNewPhoneNumber,
    inputTelError,
    setInputTelError,
  };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export default AuthContext;
