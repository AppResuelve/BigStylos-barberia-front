import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios, { all } from "axios";
import { Box, Button, Input, LinearProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [add, setAdd] = useState(false);
  const [typeUser, setTypeUser] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  /* estados de los tipos de users para condicionar cuando no se encuentran */
  const [filteredClients, setFilteredClients] = useState([]);
  const [filteredProfesionals, setFilteredProfesionals] = useState([]);
  const [filteredDelete, setFilteredDelete] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/users/all`);
        const { data } = response;
        setAllUsers(data);
        filterUsersByEmail(searchValue, data);
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
      const response = await axios.put(`${VITE_BACKEND_URL}/users/delete`, {
        email,
      });
      setAdd(!add);
    } catch (error) {
      console.error("Error al updatear usuario", error);
    }
  };

  const filterUsersByEmail = (email, users) => {
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(email.toLowerCase())
    );
    setFilteredUsers(filtered);
    // Primero, creamos tres arrays vacíos para almacenar los usuarios filtrados
    const filteredClients = [];
    const filteredProfesionals = [];
    const filteredDelete = [];

    // Luego, utilizamos el método map para iterar sobre el array de usuarios y aplicar los filtros
    filtered.forEach((user) => {
      if (user.isDelete === true) {
        filteredDelete.push(user);
      } else if (user.worker === false) {
        filteredClients.push(user);
      } else if (user.worker === true) {
        filteredProfesionals.push(user);
      }
    });

    // Finalmente, seteamos los estados locales con los arrays filtrados
    setFilteredClients(filteredClients);
    setFilteredProfesionals(filteredProfesionals);
    setFilteredDelete(filteredDelete);
  };

  useEffect(() => {
    filterUsersByEmail(searchValue, allUsers);
  }, [searchValue]);

  console.log(allUsers);
  console.log(filteredProfesionals);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {loading ? (
        <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
      ) : (
        <hr
          style={{
            width: "100%",
            marginBottom: "15px",
            border: "none",
            height: "2px",
            backgroundColor: "#2196f3",
          }}
        />
      )}
      {/* box input search */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "500px",
          marginBottom: "15px",
        }}
      >
        <Input
          type="text"
          value={searchValue}
          placeholder="Busca un usuario"
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            fontFamily: "Jost, sans-serif",
            fontWeight: "bold",
            fontSize: "20px",
            width: "100%",
            borderRadius: "5px",
            paddingLeft: "10px",
            backgroundColor: darkMode.on ? "white" : "#d6d6d5",
          }}
        />
      </Box>
      {!sm ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            style={{
              display: "flex",
              marginBottom: "10px",
            }}
          >
            <Box style={{ width: "50%" }}>
              <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                Profesionales
              </h2>
              <hr
                style={{
                  width: "100%",
                  border: "none",
                  height: "2px",
                  backgroundColor: "#2196f3",
                }}
              />
              {filteredUsers.map(
                (user, index) =>
                  allUsers.length > 0 &&
                  user &&
                  user.worker == true && (
                    <Box key={index} style={{ marginTop: "7px" }}>
                      <h4
                        style={{
                          color: darkMode.on ? "white" : darkMode.dark,
                          letterSpacing: "1px",
                        }}
                      >
                        {user.name}
                      </h4>
                      <h4
                        style={{
                          color: darkMode.on ? "white" : darkMode.dark,
                          letterSpacing: "1px",
                        }}
                      >
                        {user.email}
                      </h4>
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
                  )
              )}
              {filteredProfesionals.length < 1 && (
                <Box
                  style={{
                    marginTop: "7px",
                    display: "flex",
                    alignItems: "center",
                    height: "80px",
                  }}
                >
                  <h4>No se encontró usuario de este tipo</h4>
                </Box>
              )}
            </Box>

            <Box style={{ width: "50%" }}>
              <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                Clientes
              </h2>
              <hr
                style={{
                  width: "100%",
                  border: "none",
                  height: "2px",
                  backgroundColor: "#2196f3",
                }}
              />

              {filteredUsers.map(
                (user, index) =>
                  allUsers.length > 0 &&
                  user &&
                  !user.isDelete &&
                  user.worker === false && (
                    <Box key={index} style={{ marginTop: "7px" }}>
                      <h4
                        style={{
                          color: darkMode.on ? "white" : darkMode.dark,
                          letterSpacing: "1px",
                        }}
                      >
                        {user.name}
                      </h4>
                      <h4
                        style={{
                          color: darkMode.on ? "white" : darkMode.dark,
                          letterSpacing: "1px",
                        }}
                      >
                        {user.email}
                      </h4>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button onClick={() => handleUpdateUser(user.email)}>
                          <KeyboardDoubleArrowLeftIcon />
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.email)}
                          style={{ color: "red" }}
                        >
                          <DeleteOutlineIcon />
                        </Button>
                      </Box>

                      <hr />
                    </Box>
                  )
              )}
              {filteredClients.length < 1 && (
                <Box
                  style={{
                    marginTop: "7px",
                    display: "flex",
                    alignItems: "center",
                    height: "80px",
                  }}
                >
                  <h4>No se encontró usuario de este tipo</h4>
                </Box>
              )}
            </Box>
          </Box>
          <Box style={{ width: "100%" }}>
            <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
              Eliminados
            </h2>
            <hr
              style={{
                width: "100%",
                border: "none",
                height: "2px",
                backgroundColor: "#2196f3",
              }}
            />
            {filteredUsers.map(
              (user, index) =>
                allUsers.length > 0 &&
                user &&
                user.isDelete == true && (
                  <Box key={index} style={{ marginTop: "7px" }}>
                    <h4
                      style={{
                        color: darkMode.on ? "white" : darkMode.dark,
                        letterSpacing: "1px",
                      }}
                    >
                      {user.name}
                    </h4>
                    <h4
                      style={{
                        color: darkMode.on ? "white" : darkMode.dark,
                        letterSpacing: "1px",
                      }}
                    >
                      {user.email}
                    </h4>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        onClick={() => handleDelete(user.email)}
                        style={{ color: "orange", borderRadius: "50px" }}
                      >
                        <DeleteSweepIcon />
                      </Button>
                    </Box>

                    <hr />
                  </Box>
                )
            )}
            {filteredDelete.length < 1 && (
              <Box
                style={{
                  marginTop: "7px",
                  display: "flex",
                  alignItems: "center",
                  height: "80px",
                }}
              >
                <h4>No se encontró usuario de este tipo</h4>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        /* ///// sección users para mobile ///// */
        <Box sx={{ width: "100%" }}>
          <Box>
            <Box style={{ width: "100%" }}>
              <Button
                variant={typeUser ? "contained" : "outlined"}
                style={{
                  width: "50%",
                  fontFamily: "jost, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  borderBottom: !typeUser ? "" : "3px solid #2196f3",
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
                  borderBottom: typeUser ? "" : "3px solid #2196f3",
                }}
                onClick={() => setTypeUser(false)}
              >
                Clientes
              </Button>
            </Box>
            <Box sx={{ width: "100%" }}>
              {typeUser
                ? allUsers.length > 0 &&
                  filteredUsers.map((user, index) => {
                    if (user.worker) {
                      return (
                        <Box key={index} style={{ marginTop: "18px" }}>
                          <h4
                            style={{
                              color: darkMode.on ? "white" : darkMode.dark,
                              letterSpacing: "1px",
                            }}
                          >
                            {user.name}
                          </h4>
                          <h4
                            style={{
                              color: darkMode.on ? "white" : darkMode.dark,
                              letterSpacing: "1px",
                            }}
                          >
                            {user.email}
                          </h4>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              onClick={() => handleUpdateUser(user.email)}
                            >
                              <KeyboardDoubleArrowRightIcon />
                            </Button>
                          </Box>
                          <hr />
                        </Box>
                      );
                    }
                  })
                : allUsers.length > 0 &&
                  filteredUsers.map((user, index) => {
                    if (!user.worker && !user.isDelete) {
                      return (
                        <Box key={index} style={{ marginTop: "18px" }}>
                          <h4
                            style={{
                              color: darkMode.on ? "white" : darkMode.dark,
                              letterSpacing: "1px",
                            }}
                          >
                            {user.name}
                          </h4>
                          <h4
                            style={{
                              color: darkMode.on ? "white" : darkMode.dark,
                              letterSpacing: "1px",
                            }}
                          >
                            {user.email}
                          </h4>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              onClick={() => handleUpdateUser(user.email)}
                            >
                              <KeyboardDoubleArrowLeftIcon />
                            </Button>
                            <Button
                              onClick={() => handleDelete(user.email)}
                              style={{ color: "red" }}
                            >
                              <DeleteOutlineIcon />
                            </Button>
                          </Box>
                          <hr />
                        </Box>
                      );
                    }
                  })}
              {((filteredProfesionals.length < 1 && typeUser) ||
                (filteredClients.length < 1 && !typeUser)) && (
                <Box
                  style={{
                    marginTop: "7px",
                    display: "flex",
                    alignItems: "center",
                    height: "80px",
                  }}
                >
                  <h4>No se encontró usuario de este tipo</h4>
                </Box>
              )}
            </Box>
          </Box>
          <Box style={{ width: "100%", marginTop: "18px" }}>
            <Button
              variant="contained"
              style={{
                width: "100%",
                fontFamily: "jost, sans-serif",
                fontWeight: "bold",
                border: "none",
                borderBottom: "3px solid #2196f3",
                cursor: "auto",
                pointerEvents: "none",
              }}
            >
              Eliminados
            </Button>
            {allUsers.length > 0 &&
              filteredUsers.map((user, index) => {
                if (user.isDelete == true) {
                  return (
                    <Box key={index} style={{ marginTop: "10px" }}>
                      <h4
                        style={{
                          color: darkMode.on ? "white" : darkMode.dark,
                          letterSpacing: "1px",
                        }}
                      >
                        {user.name}
                      </h4>
                      <h4
                        style={{
                          color: darkMode.on ? "white" : darkMode.dark,
                          letterSpacing: "1px",
                        }}
                      >
                        {user.email}
                      </h4>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          onClick={() => handleDelete(user.email)}
                          style={{ color: "orange" }}
                        >
                          <DeleteSweepIcon />
                        </Button>
                      </Box>

                      <hr />
                    </Box>
                  );
                }
              })}
            {filteredDelete.length < 1 && (
              <Box
                style={{
                  marginTop: "7px",
                  display: "flex",
                  alignItems: "center",
                  height: "80px",
                }}
              >
                <h4>No se encontró usuario de este tipo</h4>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Users;
