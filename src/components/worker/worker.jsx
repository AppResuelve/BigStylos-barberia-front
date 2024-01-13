import { useEffect, useState } from "react";
import CreateWorkDays from "../createWorkDays/createWorkDays";
import NotFound from "../pageNotFound/pageNotFound";
import { Skeleton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Worker = ({ user }) => {
  const [isWorker, setIsWorker] = useState(1);
  const navigate = useNavigate();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEffect(() => {
    if (user.worker) {
      setIsWorker(true);
    } else if (user) {
      // Configuramos un setTimeout para cambiar isWorker a false después de 1000ms (1 segundo)
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
      {isWorker === 1 ? (
        <Stack spacing={5}>
          <Skeleton variant="rounded" width={340} height={100} />
          <Skeleton variant="rounded" width={340} height={100} />
          <Skeleton variant="rounded" width={340} height={100} />
        </Stack>
      ) : isWorker === true ? (
        <div>
          <h1>Administracion del worker</h1>
          <CreateWorkDays user={user} onMouseUp={handleMouseUp} isMouseDown={isMouseDown} setIsMouseDown={setIsMouseDown}/>
        </div>
      ) : null}
    </div>
  );
};

export default Worker;
