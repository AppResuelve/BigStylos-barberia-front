import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { Skeleton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WorkerAcordeon from "../interfazMUI/workerAcordeon";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { useAuth0 } from "@auth0/auth0-react";

const Worker = () => {
  const { darkMode, userData } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== 1) {
      if (!userData.worker) {
        navigate("/requestDenied401");
      }
    } else if (!isLoading && !isAuthenticated) {
      navigate("/requestDenied401");
    } else {
      return;
    }
  }, [userData, isLoading]);

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
      {isLoading ? (
        <Stack spacing={1} style={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="text"
            height={70}
            style={{
              marginBottom: !sm ? "35px" : "",
              width: "80vw",
              maxWidth: "410px",
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
        </Stack>
      ) : userData.worker ? (
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              color: !darkMode.on ? darkMode.dark : "white",
              fontSize: sm ? "28px" : "",
            }}
          >
            Administración del profesional
          </h1>
          <WorkerAcordeon user={userData} />
        </div>
      ) : null}
    </div>
  );
};

export default Worker;
