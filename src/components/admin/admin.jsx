import { useEffect, useContext } from "react";
import { DarkModeContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Skeleton, Stack } from "@mui/material";
import AdminAcordeon from "../interfazMUI/adminAcordeon";

const Admin = () => {
  const { darkMode, userData } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const navigate = useNavigate();
  console.log(userData);

  
  useEffect(() => {
    if (userData !== 1) {
      if (!userData.admin) {
        navigate("/requestDenied401");
      }
    } else if (userData === false) {
      navigate("/requestDenied401");
    }
  }, [userData]);
  
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
        <Stack spacing={1} style={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="text"
            height={70}
            style={{
              marginBottom: !sm ? "35px" : "",
              width: "80vw",
              maxWidth: "340px",
            }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
          />
          <Skeleton
            variant="rounded"
            height={58}
            style={{ width: "95vw", maxWidth: "900px" }}
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
