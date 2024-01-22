import { useEffect, useState } from "react";
import { Skeleton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WorkerAcordeon from "../interfazMUI/workerAcordeon";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

const Worker = ({ userData, userAuth, darkMode }) => {
  const navigate = useNavigate();
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  useEffect(() => {
    if (userData !== 1) {
      if (!userData.worker) {
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
        backgroundColor: darkMode ? "#28292c" : "white",
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
      ) : userData.worker ? (
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              color: darkMode ? "white" : "#28292c",
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
