import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { LoadAndRefreshProvider } from "./context/LoadAndRefreshContext.jsx";

const VITE_GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

ReactDOM.render(
  <GoogleOAuthProvider clientId={VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <LoadAndRefreshProvider>
              <App />
            </LoadAndRefreshProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
