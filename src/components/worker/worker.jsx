import { useEffect, useContext } from "react";
import { DarkModeContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import WorkerAcordeon from "../interfazMUI/workerAcordeon";
import { AdminWorkerSkeleton } from "../skeletons/skeletons";

const Worker = () => {
  const { darkMode, userData } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== 1) {
      if (!userData.worker) {
        navigate("/requestDenied401");
      }
    } else if (userData === false) {
      navigate("/requestDenied401");
    } else {
      return;
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
        <AdminWorkerSkeleton numAcordeon={[1,2,3,4]} />
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
