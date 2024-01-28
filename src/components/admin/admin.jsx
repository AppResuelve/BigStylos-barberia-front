import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { useNavigate } from "react-router-dom";
import AdminAcordeon from "../interfazMUI/adminAcordeon";
import { Skeleton, Stack } from "@mui/material";

const Admin = ({ userData, userAuth }) => {
  const { darkMode } = useContext(DarkModeContext);

  const navigate = useNavigate();
  
  useEffect(() => {
    if (userData !== 1) {
      if (!userData.admin) {
        navigate("/requestDenied401");
      }
    } else if (userAuth) {
      navigate("/requestDenied401");
    } else {
      return;
    }
  }, [userData, userAuth]);

  return (
    <div
      style={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
        alignItems: "center",
        height: "100vh",
        paddingTop: "70px",
      }}
    >
      {userData === 1 ? (
        <Stack spacing={4} style={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="text"
            height={70}
            style={{
              width: "80vw",
              maxWidth: "340px",
            }}
          />
          <Skeleton
            variant="rounded"
            height={70}
            style={{ width: "90vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={70}
            style={{ width: "90vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={70}
            style={{ width: "90vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={70}
            style={{ width: "90vw", maxWidth: "900px" }}
          />
        </Stack>
      ) : userData.admin ? ( // Puedes mostrar un componente de carga o un mensaje mientras se determina el estado de isAdmin
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              color: darkMode.on ? "white" : darkMode.dark,
            }}
          >
            Administración del local
          </h1>
          <AdminAcordeon />
        </div>
      ) : null}
    </div>
  );
};

export default Admin;
