import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import {
  convertToCategoryArray,
  convertToCategoryObj,
} from "../../helpers/convertCategoryService";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import axios from "axios"; // Asegúrate de importar axios

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PriceAndSing = ({ services, setRefreshServices }) => {
  const [categoryServices, setCategoryServices] = useState([]);
  const [editableCatSer, setEditableCatSer] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [selectedInput, setSelectedInput] = useState({
    categoryIndex: null,
    serviceIndex: null,
    name: null,
  });

useEffect(() => {
  if (Object.keys(services).length > 0) {
    const categoryArray = convertToCategoryArray(services);

    setCategoryServices(categoryArray); // Renderizar

    // Clonar el array para editar
    const editableCopy = JSON.parse(JSON.stringify(categoryArray));
    setEditableCatSer(editableCopy);
  }
}, [services]);


  const handleSaveCatSer = async () => {
    const catSerObj = convertToCategoryObj(editableCatSer);

    try {
      const result = await axios.put(`${VITE_BACKEND_URL}/services/update`, {
        services: catSerObj,
      });
      setRefreshServices((prevState) => !prevState);
      setShowEdit(false); // Salir del modo de edición después de guardar
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectInput = (categoryIndex, serviceIndex, name) => {
    if (showEdit) setSelectedInput({ categoryIndex, serviceIndex, name });
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setEditableCatSer(categoryServices);
  };

  const handleChange = (event, categoryIndex, serviceIndex, name) => {
    const { value } = event.target;
    setEditableCatSer((prevState) => {
      const updatedCatSer = [...prevState];
      updatedCatSer[categoryIndex].services[serviceIndex][name] = value;
      return updatedCatSer;
    });
  };
  console.log(editableCatSer);
  return (
    <div>
      <div style={{ marginTop: "10px", overflow: "scroll" }}>
        <div style={{ width: "100%", display: "flex" }}>
          <span
            style={{
              minWidth: "200px",
              width: "40%",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Cat. y servicios
          </span>
          <hr />
          <span
            style={{
              minWidth: "100px",
              width: "25%",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Precio
          </span>
          <hr />
          <span
            style={{
              minWidth: "100px",
              width: "25%",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Seña
          </span>
          <hr />
          <span
            style={{
              minWidth: "80px",
              width: "10%",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Tipo
          </span>
        </div>
        <hr style={{ width: sm ? "100vw" : "100%" }} />
        {editableCatSer.map((elem, categoryIndex) => {
          return (
            <div key={categoryIndex} style={{ marginTop: "10px" }}>
              <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                {capitalizeFirstLetter(elem.category)}
              </span>
              <hr style={{ width: sm ? "100vw" : "100%" }} />
              {elem.services.map((service, serviceIndex) => {
                return (
                  <>
                    <div
                      style={{ display: "flex", width: "100%" }}
                      key={serviceIndex}
                    >
                      <span style={{ minWidth: "200px", width: "40%" }}>
                        {service.name}
                      </span>
                      <hr />
                      {showEdit &&
                      selectedInput.categoryIndex === categoryIndex &&
                      selectedInput.serviceIndex === serviceIndex &&
                      selectedInput.name === "price" ? (
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) =>
                            handleChange(
                              e,
                              categoryIndex,
                              serviceIndex,
                              "price"
                            )
                          }
                          style={{
                            minWidth: "100px",
                            width: "25%",
                            padding: "5px",
                            fontSize: "16px",
                            fontFamily: "Jost, sans serif",
                            fontWeight: "bold",
                            borderRadius: "3px",
                            border: "1px solid",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            minWidth: "100px",

                            width: "25%",
                            margin: "1px",
                            padding: "5px",
                            fontWeight: "bold",
                            backgroundColor: showEdit
                              ? "lightgray"
                              : "transparent",
                            borderRadius: "3px",
                            cursor: showEdit ? "pointer" : "default",
                          }}
                          onClick={() =>
                            handleSelectInput(
                              categoryIndex,
                              serviceIndex,
                              "price"
                            )
                          }
                        >
                          ${service.price}
                        </span>
                      )}
                      <hr />
                      {showEdit &&
                      selectedInput.categoryIndex === categoryIndex &&
                      selectedInput.serviceIndex === serviceIndex &&
                      selectedInput.name === "sing" ? (
                        <input
                          type="number"
                          value={service.sing}
                          onChange={(e) =>
                            handleChange(e, categoryIndex, serviceIndex, "sing")
                          }
                          style={{
                            minWidth: "100px",
                            width: "25%",
                            padding: "5px",
                            fontSize: "16px",
                            fontFamily: "Jost, sans serif",
                            fontWeight: "bold",
                            borderRadius: "3px",
                            border: "1px solid",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            minWidth: "100px",

                            width: "25%",
                            margin: "1px",
                            padding: "5px",
                            fontWeight: "bold",
                            backgroundColor: showEdit
                              ? "lightgray"
                              : "transparent",
                            borderRadius: "3px",
                            cursor: showEdit ? "pointer" : "default",
                          }}
                          onClick={() =>
                            handleSelectInput(
                              categoryIndex,
                              serviceIndex,
                              "sing"
                            )
                          }
                        >
                        {`${service.type}${service.sing}`}
                        </span>
                      )}
                      <hr />
                      {showEdit &&
                      selectedInput.categoryIndex === categoryIndex &&
                      selectedInput.serviceIndex === serviceIndex &&
                      selectedInput.name === "type" ? (
                        <select
                          type="number"
                          value={service.type}
                          onChange={(e) =>
                            handleChange(e, categoryIndex, serviceIndex, "type")
                          }
                          style={{
                            minWidth: "80px",
                            width: "10%",
                            padding: "5px",
                            fontSize: "16px",
                            fontFamily: "Jost, sans serif",
                            fontWeight: "bold",
                            borderRadius: "3px",
                            border: "1px solid",
                          }}
                        >
                          <option value="$">$</option>
                          <option value="%">%</option>
                        </select>
                      ) : (
                        <span
                          style={{
                            minWidth: "80px",
                            width: "10%",
                            margin: "1px",
                            padding: "5px",
                            fontWeight: "bold",
                            backgroundColor: showEdit
                              ? "lightgray"
                              : "transparent",
                            borderRadius: "3px",
                            cursor: showEdit ? "pointer" : "default",
                          }}
                          onClick={() =>
                            handleSelectInput(
                              categoryIndex,
                              serviceIndex,
                              "type"
                            )
                          }
                        >
                          {service.type}
                        </span>
                      )}
                    </div>
                    <hr style={{ width: sm ? "100vw" : "100%" }} />
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "15px",
        }}
      >
        <div style={{ display: "flex" }}>
          {showEdit === false ? (
            <Button
              disabled={services !== 1 && services.length == 0 ? true : false}
              onClick={handleEdit}
            >
              <BorderColorIcon />
            </Button>
          ) : (
            <Button
              onClick={handleCancel}
              variant="outlined"
              style={{ border: "2px solid " }}
            >
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Descartar</h4>
            </Button>
          )}
        </div>
        {showEdit === true && (
          <Button onClick={handleSaveCatSer} variant="contained">
            <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
          </Button>
        )}
      </Box>
    </div>
  );
};

export default PriceAndSing;
