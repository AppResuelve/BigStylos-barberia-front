import React, { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { convertToCategoryServiceArray } from "../../helpers/convertCategoryService";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import discardIcon from "../../assets/icons/left-arrow.png";
import toastAlert from "../../helpers/alertFunction";
import DeleteServicesModal from "./deleteServicesModal";
import axios from "axios";
import { LoaderLinearProgress } from "../loaders/loaders";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Services = ({ setRefreshServices, loadingServices, services }) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(ThemeContext);
  const { setRefreshStatusSession } = useContext(AuthContext);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryServices, setCategoryServices] = useState([]);
  const [editableCatSer, setEditableCatSer] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Estado para los inputs de creacion
  const [inputs, setInputs] = useState({
    category: "",
    service: "",
    price: "",
    sing: "",
    type: "$",
  });
  // Estado para los inputs de actualizacion
  const [categoryName, setCategoryName] = useState({});
  const [serviceRow, setServiceRow] = useState({});

  useEffect(() => {
    if (services) {
      const categoryArray = convertToCategoryServiceArray(services);

      const extractedCategories = Object.keys(services);
      const extractedServices = [];

      for (const category of extractedCategories) {
        extractedServices.push(...Object.keys(services[category]));
      }
      setCategoryServices(categoryArray); //renderizar
      setEditableCatSer(categoryArray); //copia para editar
      setCategoryList(extractedCategories); //array categorias
    }
  }, [services]);

  const handleAddServiceCategory = async () => {
    try {
      const { service, category, price, sing, type } = inputs;
      if (
        service !== "" &&
        category !== "" &&
        ((sing !== "" && price !== "") ||
          (sing === "" && price === "") ||
          (price !== "" && sing == ""))
      ) {
        await axios.post(`${VITE_BACKEND_URL}/services/create`, {
          service,
          category,
          price: price == 0 ? 0 : price,
          sing: sing == 0 ? 0 : sing,
          type,
        });
        toastAlert("El servicio se agregó exitosamente.", "success");
        // Refresca la lista de servicios después de agregar uno nuevo
        setRefreshServices((prevState) => !prevState);
        setRefreshStatusSession((prevState) => !prevState);
        // Limpiar los inputs
        setInputs({
          category: "",
          service: "",
          price: "",
          sing: "",
          type: "$",
        });
      }
    } catch (error) {
      toastAlert("Error al agregar el servicio.", "error");
      console.error("Error al agregar el servicio:", error);
    }
  };

  const handleUpdateCategoryName = async () => {
    let { prev, current } = categoryName;
    try {
      const response = await axios.put(
        `${VITE_BACKEND_URL}/services/updatecategory`,
        {
          prev,
          current,
        }
      );
      toastAlert(`Categoria ${current} actualizada correctamente.`, "success");
      // Refresca la lista de servicios después de agregar uno nuevo
      setRefreshServices((prevState) => !prevState);
      setRefreshStatusSession((prevState) => !prevState);
      setCategoryName({});
      setShowEdit(false);
    } catch (error) {
      toastAlert(`Error al actualizar la categoria ${current}`, "error");
      console.error("Error al actualizar la categoria:", error);
    }
  };

  const handleUpdateServiceRow = async () => {
    try {
      // Iteramos sobre cada servicio en serviceRow
      for (let serviceName in serviceRow) {
        const { category, service, price, sing, type } =
          serviceRow[serviceName];

        // Enviamos la solicitud para actualizar cada fila de servicio
        const response = await axios.put(
          `${VITE_BACKEND_URL}/services/updateservice`,
          {
            category,
            service,
            price: price == 0 ? 0 : price,
            sing: sing == 0 ? 0 : sing,
            type,
          }
        );
        toastAlert(
          `Fila del servicio ${service} actualizada correctamente.`,
          "success"
        );
      }
      // Refresca la lista de servicios después de actualizar
      setRefreshServices((prevState) => !prevState);
      setRefreshStatusSession((prevState) => !prevState);
      setServiceRow({});
      setShowEdit(false);
    } catch (error) {
      toastAlert(`Error al actualizar el/los servicios.`, "error");
      console.error("Error al actualizar el servicio:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "price" || name === "sing") {
      if (value >= 0) {
        setInputs({
          ...inputs,
          [name]: value,
        });
      }
    } else {
      setInputs({
        ...inputs,
        [name]: value,
      });
    }
  };

  const handleCategoryInputChange = (event, newInputValue) => {
    setInputs({
      ...inputs,
      category: newInputValue,
    });
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
    setServiceRow({});
    setShowEdit(false);
  };

  //handle span
  const handleCategoryName = (categoryName) => {
    if (showEdit) {
      setCategoryName({
        prev: categoryName,
        current: categoryName,
      });
      setServiceRow({});
    }
  };

  //handle span
  const handleRowService = (service, category, discard) => {
    if (showEdit && !serviceRow[service.name]) {
      setServiceRow((prevState) => {
        return {
          ...prevState, // Hacemos una copia del estado anterior
          [service.name]: {
            category: category,
            service: service.name,
            price: service.price === 0 ? "" : service.price,
            sing: service.sing === 0 ? "" : service.sing,
            type: service.type,
          },
        };
      });
      setCategoryName({});
    } else if (showEdit && serviceRow[service.name] && discard === "discard") {
      setServiceRow((prevState) => {
        let copyState = { ...prevState }; // Hacemos una copia del estado anterior
        delete copyState[service.name]; // Eliminamos la propiedad
        return copyState; // Retornamos el estado actualizado sin la propiedad eliminada
      });
    }
  };

  //handle input
  const handleChangeCategoryName = (e) => {
    let value = e.target.value;
    setCategoryName((prevState) => {
      let copyState = { ...prevState };
      copyState.current = value;
      return copyState;
    });
  };

  //handle input
  const handleChangeRowService = (field, e, serviceName) => {
    let value = e.target.value;
    setServiceRow((prevState) => {
      let copyState = { ...prevState };
      copyState[serviceName] = { ...copyState[serviceName], [field]: value }; // Crea una copia profunda
      return copyState;
    });
  };

  const handleDiscard = () => {
    setShowEdit(false);
    setEditableCatSer(categoryServices);
    setCategoryName({});
    setServiceRow({});
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin: "10px 0px 0px 0px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "var(--bg-color)",
          }}
        >
          Selecciona o agrega categorias o servicios.
        </span>
        <div style={{ display: "flex", flexDirection: sm ? "column" : "row" }}>
          <Autocomplete
            options={categoryList}
            sx={{
              width: sm ? "100%" : "50%",
              margin: "30px 5px 0px 0px",
            }}
            value={inputs.category}
            onInputChange={handleCategoryInputChange}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={null} // No muestra nada cuando no hay opciones
            renderInput={(params) => (
              
              <TextField
                {...params}
                label="Categoría"
                placeholder="ej: Corte y barba."
                InputLabelProps={{
                  shrink: true,
                  style: { color: "var(--text-color)" },
                }}
                InputProps={{
                  ...params.InputProps, // Asegura que pase las props correctas del Autocomplete
                  style: {
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    color: "var(--text-color)",
                    backgroundColor: "var(--bg-color-hover)",
                  },
                }}
              />
            )}
          />
          <TextField
            sx={{
              width: sm ? "100%" : "50%",
              margin: sm ? "30px 0px 0px 0px" : "30px 0px 0px 5px",
            }}
            id="filled-text"
            label="Servicio"
            type="text"
            name="service"
            value={inputs.service}
            placeholder="ej: Corte de pelo."
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
              style: { color: "var(--text-color)" },
            }}
            InputProps={{
              style: {
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                color: "var(--text-color)",
                backgroundColor: "var(--bg-color-hover)",
              },
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin: "10px 0px 20px 0px",
        }}
      >
        <span
          style={{
            padding: "10px",
            margin: "20px 0px 30px 0px",
            fontSize: "18px",
            backgroundColor: "var(--bg-color)",
            borderRadius: "5px",
          }}
        >
          Ingresa un precio y la seña correspondiente.
        </span>
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <TextField
            sx={{
              width: "40%",
            }}
            id="filled-number"
            label="Precio"
            type="number"
            name="price"
            value={inputs.price}
            placeholder="0"
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
              style: { color: "var(--text-color)" },
            }}
            InputProps={{
              inputProps: { min: 0 },
              style: {
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                color: "var(--text-color)",
                backgroundColor: "var(--bg-color-hover)",
              },
            }}
          />
          <TextField
            sx={{
              width: "calc(40% - 10px)",
              margin: "0px 0px 0px 10px ",
            }}
            id="filled-number"
            label="Seña"
            type="number"
            name="sing"
            value={inputs.sing}
            placeholder="0"
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
              style: { color: "var(--text-color)" },
            }}
            InputProps={{
              inputProps: { min: 0 },
              style: {
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                color: "var(--text-color)",
                backgroundColor: "var(--bg-color-hover)",
              },
            }}
          />
          <Select
            sx={{
              width: sm ? "calc(20% - 10px)" : "20%",
              margin: "0px 0px 0px 10px",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
              color: "var(--text-color)", // Color del texto seleccionado
              backgroundColor: "var(--bg-color-hover)", // Fondo del select
            }}
            name="type"
            value={inputs.type}
            onChange={handleInputChange}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "var(--bg-color-hover)", // Fondo del menú desplegable
                  color: "var(--text-color)", // Color del texto en el menú
                },
              },
            }}
          >
            <MenuItem
              value="$"
              sx={{
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                color: "var(--text-color)",
              }}
            >
              $
            </MenuItem>
            <MenuItem
              value="%"
              sx={{
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
                color: "var(--text-color)",
              }}
            >
              %
            </MenuItem>
          </Select>
        </div>
      </div>
      <Button
        onClick={handleAddServiceCategory}
        variant="contained"
        disabled={
          inputs.service !== "" && inputs.category !== "" ? false : true
        }
        sx={{
          display: "flex",
          alignSelf: "flex-end",
          height: "40px",
          width: "150px",
          fontFamily: "Jost, sans-serif",
          fontWeight: "bold",
        }}
      >
        Agregar
      </Button>
      <hr
        style={{
          width: "100%",
          border: "2px solid var(--bg-color-medium)",
          margin: "20px 0px 20px 0px",
        }}
      />
      <table
        style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--text-color)" }}>
            <th
              style={{
                width: "40%",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "2px",
              }}
            >
              Categorías y servicios
            </th>
            <th
              style={{
                width: "30%",
                fontWeight: "bold",
                fontSize: "18px",
                borderLeft: "1px solid var(--text-color)",
                padding: "2px",
              }}
            >
              Precio
            </th>
            <th
              style={{
                width: "20%",
                fontWeight: "bold",
                fontSize: "18px",
                borderLeft: "1px solid var(--text-color)",
                padding: "2px",
              }}
            >
              Seña
            </th>
            <th
              style={{
                width: "10%",
                fontWeight: "bold",
                fontSize: "18px",
                borderLeft: "1px solid var(--text-color)",
                padding: "2px",
              }}
            >
              Tipo
            </th>
          </tr>
        </thead>
        <tbody>
          {categoryServices.length < 1 ? (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  height: "40px",
                }}
              >
                No tienes servicios aún
              </td>
            </tr>
          ) : (
            categoryServices.map((elem, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "40px",
                      padding: "2px 0px",
                    }}
                  >
                    {Object.keys(categoryName).length > 0 &&
                    categoryName.prev === elem.category ? (
                      <input
                        type="text"
                        value={categoryName.current}
                        onChange={(e) => handleChangeCategoryName(e)}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "5px",
                          border: "1px solid",
                          paddingLeft: "5px",
                          fontSize: "20px",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: "20px",
                          width: "100%",
                          padding: "4px",
                          backgroundColor: showEdit
                            ? "var(--bg-color)"
                            : "var(--transparent)",
                          cursor:
                            !showEdit ||
                            (Object.keys(categoryName).length > 0 &&
                              categoryName !== elem.category)
                              ? "default"
                              : "pointer",
                          pointerEvents:
                            Object.keys(categoryName).length > 0 &&
                            categoryName !== elem.category
                              ? "none"
                              : "",
                        }}
                        onClick={() => handleCategoryName(elem.category)}
                      >
                        {elem.category}
                      </span>
                    )}
                  </td>
                </tr>
                {elem.services.map((service, sIndex) => (
                  <tr key={sIndex} style={{ borderBottom: "1px solid" }}>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: "40px",
                        padding: "2px",
                        margin: "2px",
                        borderRadius: "5px",
                        backgroundColor: "transparent",
                        cursor: !showEdit ? "default" : "pointer",
                      }}
                      onClick={() =>
                        handleRowService(service, elem.category, "discard")
                      }
                    >
                      {serviceRow[service.name] && (
                        <img
                          src={discardIcon}
                          alt="descartar"
                          style={{
                            width: "20px",
                            marginRight: "5px",
                            filter: "var(--filter-invert)",
                          }}
                        />
                      )}
                      {service.name}
                    </td>
                    {Object.keys(serviceRow).length > 0 &&
                    serviceRow[service.name]?.category === elem.category &&
                    serviceRow[service.name]?.service === service.name ? (
                      <>
                        <td
                          style={{
                            width: "30%",
                            height: "40px",
                            padding: "2px 2px 2px 0px",
                          }}
                        >
                          <input
                            type="number"
                            value={
                              serviceRow[service.name]?.service ===
                                service.name && serviceRow[service.name]?.price
                            }
                            onChange={(e) =>
                              handleChangeRowService("price", e, service.name)
                            }
                            placeholder="0"
                            style={{
                              width: "100%",
                              height: "100%",
                              paddingLeft: "5px",
                              borderRadius: "5px",
                              border: "1px solid",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            width: "20%",
                            height: "40px",
                            padding: "2px",
                          }}
                        >
                          <input
                            type="number"
                            value={
                              serviceRow[service.name]?.service ===
                                service.name && serviceRow[service.name]?.sing
                            }
                            onChange={(e) =>
                              handleChangeRowService("sing", e, service.name)
                            }
                            placeholder="0"
                            style={{
                              width: "100%",
                              height: "100%",
                              paddingLeft: "5px",
                              borderRadius: "5px",
                              border: "1px solid",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            width: "10%",
                            height: "40px",
                            padding: "2px 0px 2px 2px",
                          }}
                        >
                          <select
                            value={
                              serviceRow[service.name]?.service ===
                                service.name && serviceRow[service.name]?.type
                            }
                            onChange={(e) =>
                              handleChangeRowService("type", e, service.name)
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "5px",
                              border: "1px solid",
                            }}
                          >
                            <option value="$">$</option>
                            <option value="%">%</option>
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          style={{
                            width: "30%",
                            padding: "5px",
                            height: "40px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            borderLeft: "1px solid",
                            backgroundColor: showEdit
                              ? "var(--bg-color)"
                              : "var(--transparent)",
                            cursor:
                              !showEdit ||
                              serviceRow[service.name]?.service === service.name
                                ? "default"
                                : "pointer",
                            pointerEvents:
                              serviceRow[service.name]?.service === service.name
                                ? "none"
                                : "",
                          }}
                          onClick={() =>
                            handleRowService(service, elem.category)
                          }
                        >
                          ${service.price}
                        </td>
                        <td
                          style={{
                            width: "20%",
                            padding: "5px",
                            height: "40px",

                            fontWeight: "bold",
                            borderLeft: "1px solid",
                            backgroundColor: showEdit
                              ? "var(--bg-color)"
                              : "var(--transparent)",
                            cursor:
                              !showEdit ||
                              serviceRow[service.name]?.service === service.name
                                ? "default"
                                : "pointer",
                            pointerEvents:
                              serviceRow[service.name]?.service === service.name
                                ? "none"
                                : "",
                          }}
                          onClick={() =>
                            handleRowService(service, elem.category)
                          }
                        >
                          {service.type === "$"
                            ? `${service.type}${service.sing}`
                            : `${service.sing}${service.type}`}
                        </td>
                        <td
                          style={{
                            width: "10%",
                            padding: "5px",
                            height: "40px",

                            fontWeight: "bold",
                            borderLeft: "1px solid",
                            backgroundColor: showEdit
                              ? "var(--bg-color)"
                              : "var(--transparent)",
                            cursor:
                              !showEdit ||
                              serviceRow[service.name]?.service === service.name
                                ? "default"
                                : "pointer",
                            pointerEvents:
                              serviceRow[service.name]?.service === service.name
                                ? "none"
                                : "",
                          }}
                          onClick={() =>
                            handleRowService(service, elem.category)
                          }
                        >
                          {service.type}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          {showEdit === false ? (
            <Button
              disabled={categoryServices.length < 1 ? true : false}
              onClick={() => {
                setShowEdit(true);
              }}
            >
              <CreateRoundedIcon />
            </Button>
          ) : (
            <Button
              style={{
                fontFamily: "Jost",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
              onClick={handleDiscard}
            >
              {`Descartar (${Object.keys(serviceRow).length})`}
            </Button>
          )}
          <hr
            style={{
              border: "2px solid var(--bg-color-medium)",
              borderRadius: "10px",
              margin: "0px 6px",
              height: "35px",
            }}
          />
          <Button
            color="error"
            disabled={categoryServices.length < 1 ? true : false}
            onClick={handleOpenDelete}
            sx={{ fontFamily: "Jost,sans serif" }}
          >
            <DeleteRoundedIcon />
          </Button>
        </div>
        {Object.keys(categoryName).length > 0 ? (
          <Button
            variant="contained"
            disabled={categoryName.current.length < 1 ? true : false}
            onClick={handleUpdateCategoryName}
            sx={{ fontFamily: "Jost,sans serif" }}
          >
            Guardar categoria
          </Button>
        ) : Object.keys(serviceRow).length > 0 ? (
          <Button
            variant="contained"
            disabled={Object.keys(serviceRow).length < 1 ? true : false}
            onClick={handleUpdateServiceRow}
            sx={{ fontFamily: "Jost,sans serif" }}
          >
            {Object.keys(serviceRow).length > 1
              ? `Guardar filas`
              : `Guardar fila`}
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={true}
            sx={{ fontFamily: "Jost,sans serif" }}
          >
            Guardar
          </Button>
        )}
      </div>
      <DeleteServicesModal
        categoryServices={categoryServices}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        setRefreshServices={setRefreshServices}
        editableCatSer={editableCatSer}
        setEditableCatSer={setEditableCatSer}
        setRefreshStatusSession={setRefreshStatusSession}
      />
    </div>
  );
};

export default Services;
