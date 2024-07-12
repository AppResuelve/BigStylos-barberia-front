import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const VITE_GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

ReactDOM.render(
  <GoogleOAuthProvider clientId={VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>,

  document.getElementById("root")
);
