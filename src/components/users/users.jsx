import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Box, Button, Input, LinearProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [allUsers, setAllUsers] = useState([]);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [add, setAdd] = useState(false);
  const [typeUser, setTypeUser] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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
  };

  useEffect(() => {
    filterUsersByEmail(searchValue, allUsers);
  }, [searchValue]);

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
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <Box style={{ display: "flex" }}>
            <Box style={{ width: "50%" }}>
              <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                Profesionales
              </h2>
              <hr
                style={{
                  width: "100%",
                  marginBottom: "15px",
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
                    <Box key={index}>
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
            </Box>

            <Box style={{ width: "50%" }}>
              <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                Clientes
              </h2>
              <hr
                style={{
                  width: "100%",
                  marginBottom: "15px",
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
                    <Box key={index}>
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
            </Box>
          </Box>
          <Box style={{ width: "100%", marginTop: "15px" }}>
            <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
              Eliminados
            </h2>
            <hr
              style={{
                width: "100%",
                marginBottom: "15px",
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
                  <Box key={index}>
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
            <Box style={{ width: "100%" }}>
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
                    if (!user.worker) {
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
                            <Button style={{ color: "red" }}>
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
          <Box style={{ width: "100%", marginTop: "18px" }}>
            <Button
              variant="contained"
              style={{
                width: "100%",
                fontFamily: "jost, sans-serif",
                fontWeight: "bold",
                border: "none",
                borderBottom: "3px solid #2196f3",
                marginBottom: "15px",
                cursor: "auto",
              }}
            >
              Eliminados
            </Button>
            {allUsers.map(
              (user, index) =>
                allUsers.length > 0 &&
                user &&
                user.isDelete == true && (
                  <Box key={index}>
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
                )
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Users;
