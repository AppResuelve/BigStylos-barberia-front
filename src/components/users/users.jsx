import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, LinearProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [add, setAdd] = useState(false);
  const [typeUser, setTypeUser] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/users/all`);
        const { data } = response;
        setAllUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
        alert("Error al obtener los usuarios");
      }
    };
    fetchData();
  }, [add]);


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

  const handleDelete = async (email) => {
    try {
      console.log(email)
      const response = await axios.put(`${VITE_BACKEND_URL}/users/delete`, {email});
      setAdd(!add);
    } catch (error) {
      console.error("Error al updatear usuario", error);
    }
  }

  return (
    <div>
      {loading ? (
        <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
      ) : (
        <hr
          style={{
            marginBottom: "15px",
            border: "none",
            height: "2px",
            backgroundColor: "#2196f3",
          }}
        />
      )}
      {!sm ? (
        <Box style={{ display: "flex", flexDirection: "column" }}>
          <Box style={{ display: "flex" }}>
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
                        //height: 400px;
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
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
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button onClick={() => handleUpdateUser(user.email)}>
                          <KeyboardDoubleArrowLeftIcon />
                        </Button>
                        <Button onClick={() => handleDelete(user.email)} style={{ color: "red", borderRadius: "50px" }}>
                          <DeleteOutlineIcon />
                        </Button>
                      </Box>

                      <hr />
                    </Box>
                  )
              )}
            </Box>
          </Box>

          <Box style={{ width: "100%" }}>
            <h2>Eliminados</h2>
            {allUsers.map(
              (user, index) =>
                allUsers.length > 0 &&
                user &&
                user.isDelete == true && (
                  <Box key={index}>
                    <h4>{user.name}</h4>
                    <h4>{user.email}</h4>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >

                      <Button onClick={() => handleDelete(user.email)} style={{ color: "orange", borderRadius: "50px" }}>
                        <DeleteSweepIcon />
                      </Button>
                    </Box>

                    <hr />
                  </Box>
                )
            )}
          </Box>
        </Box>
      ) : (
        /* ///// sección users para mobile ///// */
        <Box>
          <Box>
            <Box style={{ width: "100%" }}>
              <Button
                variant={typeUser ? "contained" : "outlined"}
                style={{
                  width: "50%",
                  fontFamily: "jost, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  borderBottom: !typeUser ? "3px solid" : "3px solid #2196f3",
                  borderRadius: typeUser
                    ? "20px 20px 0px 0px"
                    : "5px 5px 0px 0px",
                }}
                onClick={() => setTypeUser(true)}
              >
                Profesionales
              </Button>
              <Button
                variant={!typeUser ? "contained" : "outlined"}
                style={{
                  width: "50%",
                  fontFamily: "jost, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  borderBottom: typeUser ? "3px solid" : "3px solid #2196f3",
                  borderRadius: !typeUser
                    ? "20px 20px 0px 0px"
                    : "5px 5px 0px 0px",
                }}
                onClick={() => setTypeUser(false)}
              >
                Clientes
              </Button>
            </Box>
            <Box style={{ width: "100%" }}>
              {
                typeUser
                  ? allUsers.length > 0 &&
                  allUsers.map((user, index) => {
                    if (user.worker) {
                      return (
                        <Box key={index} style={{ marginTop: "18px" }}>
                          <h4>{user.name}</h4>
                          <h4>{user.email}</h4>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button onClick={() => handleUpdateUser(user.email)}>
                              <KeyboardDoubleArrowRightIcon />
                            </Button>
                          </Box>
                          <hr />
                        </Box>
                      );
                    }
                  })
                  : allUsers.length > 0 &&
                  allUsers.map((user, index) => {
                    if (!user.worker) {
                      return (
                        <Box key={index} style={{ marginTop: "18px" }}>
                          <h4>{user.name}</h4>
                          <h4>{user.email}</h4>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button onClick={() => handleUpdateUser(user.email)}>
                              <KeyboardDoubleArrowRightIcon />
                            </Button>
                            <Button
                              style={{ color: "red", borderRadius: "50px" }}
                            >
                              <DeleteOutlineIcon />
                            </Button>
                          </Box>
                          <hr />
                        </Box>
                      );
                    }
                  })}

            </Box>

          </Box>
          <Box style={{ width: "100%" }}>
            <h2>Eliminados</h2>
            {allUsers.map(
              (user, index) =>
                allUsers.length > 0 &&
                user &&
                user.isDelete == true && (
                  <Box key={index}>
                    <h4>{user.name}</h4>
                    <h4>{user.email}</h4>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >

                      <Button onClick={() => handleDelete(user.email)} style={{ color: "orange", borderRadius: "50px" }}>
                        <DeleteSweepIcon />
                      </Button>
                    </Box>

                    <hr />
                  </Box>
                )
            )}
          </Box>
        </Box>

      )}
    </div>
  );
};

export default Users;
