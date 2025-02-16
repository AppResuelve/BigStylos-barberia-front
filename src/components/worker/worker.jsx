import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import WorkerAcordeon from "./workerAcordeon";
import { AdminWorkerSkeleton } from "../loaders/skeletons";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";

const Worker = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData } = useContext(AuthContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== 1) {
      if (!userData.worker) {
        navigate("/denied-access");
      }
    } else if (userData === false) {
      navigate("/denied-access");
    }
  }, [userData]);

  return (
    <div className="container-administration">
      {userData === 1 ? (
        <AdminWorkerSkeleton numAcordeon={[1, 2, 3, 4]} />
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
          <WorkerAcordeon userData={userData} />
        </div>
      ) : null}
    </div>
  );
};

export default Worker;
