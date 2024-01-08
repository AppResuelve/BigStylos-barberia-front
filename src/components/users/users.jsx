import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Grid } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [add, setAdd] = useState(false);

  const handleUpdateUser = async (email) => {
    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/users/update`, {
        email,
      });
      setAdd(!add);
    } catch {
      console.error("Error al updatear usuario", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/users/all`);
        const { data } = response;
        setAllUsers(data);
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
        alert("Error al obtener los usuarios");
      }
    };
    fetchData();
  }, [add]);

  return (
    <div style={{ display: "flex" }}>
      <Box style={{ width: "50%" }}>
        <h2>Profesionales</h2>
        {allUsers.map(
          (user, index) =>
            allUsers.length > 0 &&
            user &&
            user.worker == true && (
              <Box key={index}>
                <h4>{user.name}</h4>
                <h4>{user.email}</h4>
                <Box
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button style={{ color: "red", borderRadius: "50px" }}>
                    <DeleteOutlineIcon />
                  </Button>
                  <Button onClick={() => handleUpdateUser(user.email)}>
                    <KeyboardDoubleArrowRightIcon />
                  </Button>
                </Box>
                <hr />
              </Box>
            )
        )}
      </Box>
      <Box style={{ width: "50%" }}>
        <h2>Clientes</h2>
        {allUsers.map(
          (user, index) =>
            allUsers.length > 0 &&
            user &&
            user.worker == false && (
              <Box key={index}>
                <h4>{user.name}</h4>
                <h4>{user.email}</h4>
                <Box
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button onClick={() => handleUpdateUser(user.email)}>
                    <KeyboardDoubleArrowLeftIcon />
                  </Button>
                  <Button style={{ color: "red", borderRadius: "50px" }}>
                    <DeleteOutlineIcon />
                  </Button>
                </Box>

                <hr />
              </Box>
            )
        )}
      </Box>
    </div>
  );
};

export default Users;
