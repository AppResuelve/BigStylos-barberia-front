import { useEffect } from "react";
import { Skeleton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WorkerAcordeon from "../interfazMUI/workerAcordeon";

const Worker = ({ userData, userAuth }) => {
  const navigate = useNavigate();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

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
    <div onMouseUp={handleMouseUp}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        paddingTop: "70px",
      }}
    >
      {userData === 1 ? (
        <Stack spacing={5}>
          <Skeleton variant="rounded" width={340} height={100} />
          <Skeleton variant="rounded" width={340} height={100} />
          <Skeleton variant="rounded" width={340} height={100} />
        </Stack>
      ) : userData.worker ? (
        <div>
          <h1>Administracion del worker</h1>
          <WorkerAcordeon user={userData} />
        </div>
      ) : null}
    </div>
  );
};

export default Worker;
