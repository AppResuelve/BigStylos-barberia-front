// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import Swal from "sweetalert2";
import { urlBase64ToUint8Array } from "./helpers/urlBase64ToUint8Array";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const firebaseConfig = {
  apiKey: "AIzaSyA64eJD2gSCTvEIse4Clnfbe4GUR8DL8UA",
  authDomain: "tengoturno-prueba-noti.firebaseapp.com",
  projectId: "tengoturno-prueba-noti",
  storageBucket: "tengoturno-prueba-noti.appspot.com",
  messagingSenderId: "844370957608",
  appId: "1:844370957608:web:b178c73db0aafe9d336c1d",
  measurementId: "G-F6FEFQV8T3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const subscribeUserToPush = async (userId) => {
  try {
    Swal.fire({
      title:
        "Activar las notificaciones nos permitirá enviarte recordatorios de tus turnos.",
      showDenyButton: true,
      confirmButtonText: "Mostrame",
      denyButtonText: "Más tarde",
    }).then(async (result) => {
      let token = null;
      if (result.isConfirmed) {
        // Solicitar permiso para mostrar notificaciones
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("me direon permiso");

          // Add the public key generated from the console here.
          token = await getToken(messaging, {
            vapidKey:
              "BMlDO_r9EJzVDqamIEeVsnx2KpikYIuZdpnGvPaXIuE9kpLGqilPxnos9r9jN-cMtlBKUdShH9A0rTk_1DSITkk",
          });

          if (token) {
            //mandar el token a la prop pushToken del user
            const response = await axios.put(
              `${VITE_BACKEND_URL}/pushnotifications/updateusertoken`,
              {
                token,
                userId,
              }
            );
            console.log(token);
          } else {
            console.error(error);
          }
        } else {
          //poner la prop del user pushToken = null
        }
      } else {
        //poner la prop del user pushToken = null

        console.error("Permiso para notificaciones no concedido.");
      }
      if (token === null) {
        try {
          const response = await axios.put(
            `${VITE_BACKEND_URL}/pushnotifications/updateusertoken`,
            {
              token,
              userId,
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    });

    // // Suscribirse al servicio de push
    // const subscription = await registration.pushManager.subscribe({
    //   userVisibleOnly: true, // Debe ser true para garantizar que el usuario vea la notificación
    //   applicationServerKey: urlBase64ToUint8Array(
    //     "BMlDO_r9EJzVDqamIEeVsnx2KpikYIuZdpnGvPaXIuE9kpLGqilPxnos9r9jN-cMtlBKUdShH9A0rTk_1DSITkk"
    //   ), // Clave pública VAPID
    // });

    // // Enviar la suscripción al servidor para guardarla
    // await fetch("/api/save-subscription", {
    //   method: "POST",
    //   body: JSON.stringify(subscription),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    console.log("Usuario suscrito:" /* subscription */);
  } catch (error) {
    console.error("Error al suscribir al usuario:", error);
  }
};
