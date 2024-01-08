import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAcordeon from "../interfazMUI/adminAcordeon";
import { Skeleton, Stack } from "@mui/material";

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(1);
  useEffect(() => {
    if (user.admin) {
      setIsAdmin(true);
    } else if (user) {
      const timeoutId = setTimeout(() => {
        navigate("/requestDenied401");
      }, 1000);

      // Limpiamos el timeout en el caso de que el componente se desmonte antes de que se cumpla el tiempo
      return () => clearTimeout(timeoutId);
    } else {
      return;
    }
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        paddingTop: "70px",
      }}
    >
      {isAdmin === 1 ? (
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
      ) : isAdmin === true ? ( // Puedes mostrar un componente de carga o un mensaje mientras se determina el estado de isAdmin
        <div>
          <h1 style={{ display: "flex", justifyContent: "center" }}>
            Administración del local
          </h1>
          <AdminAcordeon />
        </div>
      ) : null}
    </div>
  );
};

export default Admin;
