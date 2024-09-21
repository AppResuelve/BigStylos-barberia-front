importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);
const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const firebaseConfig = {
  apiKey: "AIzaSyA64eJD2gSCTvEIse4Clnfbe4GUR8DL8UA",
  authDomain: "tengoturno-prueba-noti.firebaseapp.com",
  projectId: "tengoturno-prueba-noti",
  storageBucket: "tengoturno-prueba-noti.appspot.com",
  messagingSenderId: "844370957608",
  appId: "1:844370957608:web:b178c73db0aafe9d336c1d",
  measurementId: "G-F6FEFQV8T3",
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  // previo a mostrar notificación
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "",
    badge:
      "",
    data: {
      url: payload.data?.click_action || `${VITE_FRONTEND_URL}/`, // URL predeterminada o la que envíes
    },
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  const urlToOpen = event.notification.data.url; // La URL que se abrió
  event.notification.close(); // Cierra la notificación al hacer clic

  // Abre una nueva ventana o enfoca una ya existente con la URL
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          console.log(clientList[i]);

          let client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
