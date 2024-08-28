import React, { useEffect, useState, useContext } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { convertToCategoryServiceArray } from "../../helpers/convertCategoryService";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import EditServicesModal from "./editServicesModal";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";
import ThemeContext from "../../context/ThemeContext";
import Swal from "sweetalert2";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Services = ({
  setRefreshServices,
  loadingServices,
  services,
  setServices,
  setLoadingServices,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(ThemeContext);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryServices, setCategoryServices] = useState([]);
  const [editableCatSer, setEditableCatSer] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [openEdition, setOpenEdition] = useState(false);

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
      // setServiceList(extractedServices); //array servicios
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
        Swal.fire({
          title: "El servicio se agregó exitosamente",
          icon: "success",
          timer: 3000,
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          showCloseButton: true,
        });
        // Refresca la lista de servicios después de agregar uno nuevo
        setRefreshServices((prevState) => !prevState);
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
      Swal.fire({
        title: "Error al agregar el servicio",
        icon: "error",
        timer: 3000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        showCloseButton: true,
      });
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
      Swal.fire({
        title: `Categoria ${current} actualizada correctamente.`,
        icon: "success",
        timer: 3000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        showCloseButton: true,
      });
      // Refresca la lista de servicios después de agregar uno nuevo
      setRefreshServices((prevState) => !prevState);
      setCategoryName({});
      setShowEdit(false);
    } catch (error) {
      Swal.fire({
        title: `Error al actualizar la categoria ${current}`,
        icon: "error",
        timer: 3000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        showCloseButton: true,
      });
      console.error("Error al actualizar la categoria:", error);
    }
  };

  const handleUpdateServiceRow = async () => {
    let { category, prev, current, price, sing, type } = serviceRow;
    try {
      const response = await axios.put(
        `${VITE_BACKEND_URL}/services/updateservice`,
        {
          category,
          prev,
          current,
          price,
          sing,
          type,
        }
      );
      Swal.fire({
        title: `Fila del servicio ${current} actualizada correctamente.`,
        icon: "success",
        timer: 3000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        showCloseButton: true,
      });
      // Refresca la lista de servicios después de agregar uno nuevo
      setRefreshServices((prevState) => !prevState);
      setServiceRow({});
      setShowEdit(false);
    } catch (error) {
      Swal.fire({
        title: `Error al actualizar la fila del servicio ${prev} al ${current}.`,
        icon: "success",
        timer: 3000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        showCloseButton: true,
      });
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
    setOpenEdition(true);
  };

  //handle span
  const handleCategoryName = (categoryName) => {
    if (showEdit) {
      setCategoryName({
        prev: categoryName,
        current: categoryName,
      });
    }
  };

  //handle span
  const handleRowService = (service, category) => {
    if (showEdit) {
      setServiceRow({
        category: category,
        prev: service.name,
        current: service.name,
        price: service.price === 0 ? "" : service.price,
        sing: service.sing === 0 ? "" : service.sing,
        type: service.type,
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

  console.log(serviceRow);
  //handle input
  const handleChangeRowService = (field, e) => {
    let value = e.target.value;

    setServiceRow((prevState) => {
      let copyState = { ...prevState };
      copyState[field] = value;
      return copyState;
    });
  };

  const handleDiscard = () => {
    if (Object.keys(serviceRow).length > 0) {
      setCategoryName({});
      setServiceRow({});
    } else {
      setShowEdit(false);
      setEditableCatSer(categoryServices);
      setCategoryName({});
      setServiceRow({});
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loadingServices ? (
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
            fontWeight: "bold",
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "lightgray",
          }}
        >
          Selecciona o agrega categorias o servicios.
        </span>
        <div style={{ display: "flex", flexDirection: sm ? "column" : "row" }}>
          <Autocomplete
            options={categoryList}
            sx={{
              width: sm ? "100%" : "50%",
              margin: "20px 5px 0px 0px",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
            }}
            value={inputs.category}
            onInputChange={handleCategoryInputChange}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <TextField {...params} label="Categoría" />
            )}
          />
          <TextField
            sx={{
              width: sm ? "100%" : "50%",
              margin: sm ? "20px 0px 0px 0px" : "20px 0px 0px 5px",
              fontFamily: "Jost, sans-serif",
              fontWeight: "bold",
            }}
            id="filled-text"
            label="Servicio"
            type="text"
            name="service"
            value={inputs.service}
            placeholder="ej: corte de pelo"
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
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
            margin: "20px 0px 20px 0px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "lightgray",
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
            InputProps={{ inputProps: { min: 0 } }}
            InputLabelProps={{
              shrink: true,
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
            InputProps={{ inputProps: { min: 0 } }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Select
            sx={{
              width: sm ? "calc(20% - 10px)" : "20%",
              margin: "0px 0px 0px 10px ",
            }}
            label=""
            name="type"
            value={inputs.type}
            onChange={handleInputChange}
          >
            <MenuItem
              value="$"
              style={{
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
              }}
            >
              $
            </MenuItem>
            <MenuItem
              value="%"
              style={{
                fontFamily: "Jost, sans-serif",
                fontWeight: "bold",
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
          border: "2px solid lightgray",
          borderRadius: "10px",
          margin: "20px 0px 20px 0px",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <div
          style={{ width: "100%", display: "flex", borderBottom: "2px solid" }}
        >
          <span
            style={{
              width: "40%",
              fontWeight: "bold",
              fontSize: "18px",
              padding: "2px",
            }}
          >
            Categorias y servicios
          </span>
          <span
            style={{
              width: "30%",
              fontWeight: "bold",
              fontSize: "18px",
              borderLeft: "1px solid",
              padding: "2px",
            }}
          >
            Precio
          </span>
          <span
            style={{
              width: "20%",
              fontWeight: "bold",
              fontSize: "18px",
              borderLeft: "1px solid",
              padding: "2px",
            }}
          >
            Seña
          </span>
          <span
            style={{
              width: "10%",
              fontWeight: "bold",
              fontSize: "18px",
              borderLeft: "1px solid",
              padding: "2px",
            }}
          >
            Tipo
          </span>
        </div>
        {categoryServices.length < 1 ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              fontSize: "18px",
            }}
          >
            No tienes servicios aún
          </span>
        ) : (
          categoryServices.map((elem, index) => {
            return (
              <div key={index} style={{ marginTop: "10px" }}>
                {Object.keys(categoryName).length > 0 &&
                categoryName.prev === elem.category ? (
                  <input
                    type="text"
                    value={categoryName.current}
                    onChange={(e) => handleChangeCategoryName(e)}
                  />
                ) : (
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      padding: "2px",
                      backgroundColor: showEdit ? "lightgray" : "transparent",
                      cursor:
                        !showEdit ||
                        ((Object.keys(categoryName).length > 0 ||
                          Object.keys(serviceRow).length > 0) &&
                          serviceRow.prev !== elem.category)
                          ? "default"
                          : "pointer",
                      filter:
                        (Object.keys(categoryName).length > 0 ||
                          Object.keys(serviceRow).length > 0) &&
                        categoryName !== elem.category
                          ? "blur(2px)"
                          : "",
                      pointerEvents:
                        (Object.keys(categoryName).length > 0 ||
                          Object.keys(serviceRow).length > 0) &&
                        categoryName !== elem.category
                          ? "none"
                          : "",
                    }}
                    onClick={() => handleCategoryName(elem.category)}
                  >
                    {elem.category}
                  </span>
                )}
                <hr style={{ border: "1px solid" }} />
                {elem.services.map((service, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          borderBottom: "1px solid",
                        }}
                      >
                        {Object.keys(serviceRow).length > 0 &&
                        serviceRow.category === elem.category &&
                        serviceRow.prev === service.name ? (
                          <>
                            <input
                              type="text"
                              style={{
                                width: "40%",
                                padding: "5px",
                              }}
                              value={
                                serviceRow.prev === service.name &&
                                serviceRow.current
                              }
                              onChange={(e) =>
                                handleChangeRowService("current", e)
                              }
                            />
                            <input
                              type="number"
                              style={{
                                width: "30%",
                                padding: "5px",
                              }}
                              value={
                                serviceRow.prev === service.name &&
                                serviceRow.price
                              }
                              onChange={(e) =>
                                handleChangeRowService("price", e)
                              }
                              placeholder="0"
                            />
                            <input
                              type="number"
                              style={{
                                width: "20%",
                                padding: "5px",
                              }}
                              value={
                                serviceRow.prev === service.name &&
                                serviceRow.sing
                              }
                              onChange={(e) =>
                                handleChangeRowService("sing", e)
                              }
                              placeholder="0"
                            />
                            <select
                              style={{
                                width: "10%",
                                padding: "5px",
                              }}
                              value={
                                serviceRow.prev === service.name &&
                                serviceRow.type
                              }
                              onChange={(e) =>
                                handleChangeRowService("type", e)
                              }
                            >
                              <option value="$">$</option>
                              <option value="%">%</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <span
                              style={{
                                width: "40%",
                                padding: "5px",
                                backgroundColor: showEdit
                                  ? "lightgray"
                                  : "transparent",
                                cursor:
                                  !showEdit ||
                                  ((Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                    serviceRow.prev !== service.name)
                                    ? "default"
                                    : "pointer",
                                filter:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
                                    ? "blur(2px)"
                                    : "",
                                pointerEvents:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
                                    ? "none"
                                    : "",
                              }}
                              onClick={() =>
                                handleRowService(service, elem.category)
                              }
                            >
                              {service.name}
                            </span>
                            <span
                              style={{
                                width: "30%",
                                padding: "5px",
                                fontWeight: "bold",
                                borderLeft: "1px solid",
                                backgroundColor: showEdit
                                  ? "lightgray"
                                  : "transparent",
                                cursor:
                                  !showEdit ||
                                  ((Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                    serviceRow.prev !== service.name)
                                    ? "default"
                                    : "pointer",
                                filter:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
                                    ? "blur(2px)"
                                    : "",
                                pointerEvents:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
                                    ? "none"
                                    : "",
                              }}
                              onClick={() =>
                                handleRowService(service, elem.category)
                              }
                            >
                              ${service.price}
                            </span>

                            <span
                              style={{
                                width: "20%",
                                padding: "5px",
                                fontWeight: "bold",
                                borderLeft: "1px solid",
                                backgroundColor: showEdit
                                  ? "lightgray"
                                  : "transparent",
                                cursor:
                                  !showEdit ||
                                  ((Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                    serviceRow.prev !== service.name)
                                    ? "default"
                                    : "pointer",
                                filter:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
                                    ? "blur(2px)"
                                    : "",
                                pointerEvents:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
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
                            </span>
                            <span
                              style={{
                                width: "10%",
                                padding: "5px",
                                fontWeight: "bold",
                                borderLeft: "1px solid",
                                backgroundColor: showEdit
                                  ? "lightgray"
                                  : "transparent",
                                cursor:
                                  !showEdit ||
                                  ((Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                    serviceRow.prev !== service.name)
                                    ? "default"
                                    : "pointer",
                                filter:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
                                    ? "blur(2px)"
                                    : "",
                                pointerEvents:
                                  (Object.keys(categoryName).length > 0 ||
                                    Object.keys(serviceRow).length > 0) &&
                                  serviceRow.prev !== service.name
                                    ? "none"
                                    : "",
                              }}
                              onClick={() =>
                                handleRowService(service, elem.category)
                              }
                            >
                              {service.type}
                            </span>
                          </>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
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
            <Button onClick={handleDiscard} variant="outlined">
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Descartar</h4>
            </Button>
          )}
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
            disabled={serviceRow.current.length < 1 ? true : false}
            onClick={handleUpdateServiceRow}
            sx={{ fontFamily: "Jost,sans serif" }}
          >
            Guardar fila
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={
              showEdit &&
              Object.keys(serviceRow).length > 0 &&
              Object.keys(serviceRow).length > 0
                ? false
                : true
            }
            sx={{ fontFamily: "Jost,sans serif" }}
          >
            Guardar
          </Button>
        )}
      </div>

      <EditServicesModal
        categoryServices={categoryServices}
        openEdition={openEdition}
        setOpenEdition={setOpenEdition}
        setRefreshServices={setRefreshServices}
        editableCatSer={editableCatSer}
        setEditableCatSer={setEditableCatSer}
      />
    </div>
  );
};

export default Services;
