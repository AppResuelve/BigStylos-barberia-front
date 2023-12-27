import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Services from "../services/services";
import NotFound from "../page_not_found/not_found";
import axios from "axios";
import Users from "../users/users";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      const email = user.email;
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/users/getadmin`,
            { email: email }
          );
          const { data } = response;
          setIsAdmin(data.isadmin);
        } catch (error) {
          console.error("Error al obtener la credencial:", error);
          alert("Error al obtener la credencial");
        }
      };
      fetchData();
    } else {
      setIsAdmin(false);
    }
  }, [user]);


  return (
    <div>
      {isAdmin === true && isAdmin ? (
        <div>
          <h1>Administracion del admin</h1>
          <hr />
          <Services />
          <hr />
          <Users />
          <hr />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Admin;
