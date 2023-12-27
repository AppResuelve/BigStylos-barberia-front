import { useEffect, useState } from "react";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [sendAdd, setSendAdd] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/users/all`);
        const { data } = response;
        setAllUsers(data.allUsers);
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
        alert("Error al obtener los usuarios");
      }
    };
    fetchData();
  }, [sendAdd]);

  const workers = [];
  const users = [];
  // Recorre el array de objetos
  if (allUsers.length > 0) {
    for (const obj of allUsers) {
      if (obj.worker) {
        // Si la propiedad "worker" es true, agrega al array "workers"
        workers.push(obj);
      } else {
        // Si la propiedad "worker" es false, agrega al array "users"
        users.push(obj);
      }
    }
  }

  const addWorkerHandler = async (email) => {
    try {
      const result = await axios.put(`${VITE_BACKEND_URL}/users/workerstatus`, {
        email: email,
        status: true,
      });

      // Refresca la lista de servicios después de agregar uno nuevo
      setSendAdd(!sendAdd);
    } catch (error) {
      console.error("Error al actualizar al usuario", error);
      alert("Error al actualizar al usuario");
    }
  };

  const deleteWorkerHandler = async (email) => {
    try {
      // Lógica para eliminar el worker por su email
      const result = await axios.put(`${VITE_BACKEND_URL}/users/workerstatus`, {
        email: email,
        status: false,
      });

      // Refresca la lista de servicios después de eliminar uno
      setSendAdd(!sendAdd);
    } catch (error) {
      console.error("Error borrar al usuario", error);
      alert("Error al borrar el usuario");
    }
  };

  const deleteUserHandler = async (email) => {
    try {
      // Lógica para eliminar el worker por su email
      const result = await axios.delete(`${VITE_BACKEND_URL}/users/delete`, {
        data: { email: email },
      });

      // Refresca la lista de servicios después de eliminar uno
      setSendAdd(!sendAdd);
    } catch (error) {
      console.error("Error borrar al usuario", error);
      alert("Error al borrar el usuario");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "green",
        justifyContent: "space-between",
      }}
    >
      <div>
        {users.length > 0 &&
          users.map((element, index) => (
            <div key={index}>
              <h2>{element.name}</h2>
              <button onClick={() => addWorkerHandler(element.email)}>
                asignar trabajador
              </button>
              <button onClick={() => deleteUserHandler(element.email)}>
                eliminar usuario
              </button>
            </div>
          ))}
      </div>
      <div style={{ backgroundColor: "red" }}>
        {workers.length > 0 &&
          workers.map((element, index) => (
            <div key={index}>
              <h2>{element.name}</h2>
              <button onClick={() => deleteWorkerHandler(element.email)}>
                eliminar trabajador
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Users;
