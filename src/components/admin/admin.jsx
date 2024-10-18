import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import AdminAcordeon from "./adminAcordeon";
import { AdminWorkerSkeleton } from "../loaders/skeletons";

const Admin = () => {
  const { userData } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== 1) {
      if (!userData.admin) {
        navigate("/denied-access");
      }
    } else if (userData === false) {
      navigate("/denied-access");
    }
  }, [userData]);

  return (
    <div className="container-administration">
      {userData === 1 ? (
        <AdminWorkerSkeleton numAcordeon={[1, 2, 3, 4, 5, 6, 7, 8]} />
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
