import { useState } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { IconButton } from "@mui/material";
import closeBtn from "../../assets/icons/close.png";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditServicesModal = ({
  categoryServices,
  editableCatSer,
  setEditableCatSer,
  openEdition,
  setOpenEdition,
  setRefreshServices,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(true);
  const [selectedInput, setSelectedInput] = useState({
    categoryIndex: null,
    serviceIndex: null,
  });
  const [servicesToDelete, setServicesToDetele] = useState([]);

  const handleSaveCatSer = async () => {
    try {
      const result = await axios.post(`${VITE_BACKEND_URL}/services/delete`, {
        services: servicesToDelete,
      });
      //en vez de hacer refresh se puede setear los estados servicios
      //con el result.(luego de ejecutar la funcion convertCategoryService)
      setRefreshServices((prevState) => {
       let copyState = !prevState;
        return copyState;
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleClose = () => {
    setOpenEdition(false);
    setServicesToDetele([]);
    setEditableCatSer(categoryServices);
  };

  const handleSelectInput = (categoryIndex, serviceIndex = null) => {
    if (showEdit) setSelectedInput({ categoryIndex, serviceIndex });
  };

  const handleCheckboxChange = (e, category, serviceName) => {
    let categoryName = category.category;
    let checked = e.target.checked;
    if (e.target.name === "") {
      setServicesToDetele((prevState) => {
        let copyState = [...prevState];
        if (checked) {
          copyState.push(serviceName);
          return copyState;
        } else {
          let filteredCopy = copyState.filter(
            (service) => service === serviceName
          );
          return filteredCopy;
        }
      });
    } else {
      if (!checked) {
        setServicesToDetele((prevState) => {
          let copyState = [...prevState];
          for (const service of category.services) {
            let filter = copyState.filter((ser) => ser === service.name);
            copyState = filter;
          }
          return copyState;
        });
      } else {
        setServicesToDetele((prevState) => {
          let copyState = [...prevState];
          for (const service of category.services) {
            let esta = false;
            for (const serv of copyState) {
              if (service.name === serv) esta = true;
            }
            if (!esta) copyState.push(service.name);
          }
          return copyState;
        });
      }
    }

    const updatedCategoryServices = editableCatSer.map((category) => {
      if (category.category === categoryName) {
        if (serviceName === undefined) {
          const newDeletedStatus = !category.deleted;
          return {
            ...category,
            deleted: newDeletedStatus,
            services: category.services.map((service) => ({
              ...service,
              deleted: newDeletedStatus,
            })),
          };
        } else {
          const updatedServices = category.services.map((service) => {
            if (service.name === serviceName) {
              return {
                ...service,
                deleted: !service.deleted,
              };
            }
            return service;
          });
          const allServicesDeleted = updatedServices.every(
            (service) => service.deleted
          );
          return {
            ...category,
            deleted: allServicesDeleted,
            services: updatedServices,
          };
        }
      }
      return category;
    });

    setEditableCatSer(updatedCategoryServices);
  };

  const handleCategoryNameChange = (index, newName) => {
    const updatedCategories = editableCatSer.map((category, categoryIndex) => {
      if (categoryIndex === index) {
        return {
          ...category,
          category: newName,
        };
      }
      return category;
    });
    setEditableCatSer(updatedCategories);
  };

  const handleServiceNameChange = (categoryIndex, serviceIndex, newName) => {
    const updatedCategories = editableCatSer.map((category, catIndex) => {
      if (catIndex === categoryIndex) {
        const updatedServices = category.services.map((service, servIndex) => {
          if (servIndex === serviceIndex) {
            return {
              ...service,
              name: newName,
            };
          }
          return service;
        });
        return {
          ...category,
          services: updatedServices,
        };
      }
      return category;
    });
    setEditableCatSer(updatedCategories);
  };

  return (
    <>
      <Dialog
        fullScreen={sm ? true : false}
        fullWidth={true}
        maxWidth="sm"
        open={openEdition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <h2
            style={{
              display: "flex",
              margin: "10px",
              fontFamily: "Jost, sans serif",
              fontWeight: "bold",
            }}
          >
            Cambio de nombre o borrado de categorias y/o servicios.
          </h2>
          <IconButton
            onClick={handleClose}
            variant="contained"
            sx={{
              fontFamily: "PoiretOne",
              fontWeight: "bold",
              width: "40px",
              height: "40px",
            }}
          >
            <img
              src={closeBtn}
              alt="cerrar"
              style={{ width: "15px", height: "15px" }}
            />
          </IconButton>
        </Box>
        <hr />
        <DialogContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <section>
            {editableCatSer.map((elem, categoryIndex) => {
              return (
                <div key={categoryIndex} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderBottom: "1px solid",
                    }}
                  >
                    {showEdit &&
                    selectedInput.categoryIndex === categoryIndex &&
                    selectedInput.serviceIndex === null ? (
                      <input
                        type="text"
                        style={{
                          width: "50%",
                          height: "30px",
                          fontFamily: "Jost, sans serif",
                          fontWeight: "bold",
                          fontSize: "18px",
                          border: "2px solid",
                          borderRadius: "4px",
                          paddingLeft: "2px",
                        }}
                        value={elem.category}
                        onChange={(e) =>
                          handleCategoryNameChange(
                            categoryIndex,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          width: "170px",
                          backgroundColor: showEdit
                            ? "lightgray"
                            : "transparent",
                          borderRadius: "3px",
                          cursor: showEdit ? "pointer" : "default",
                          padding: "2px",
                        }}
                        onClick={() => handleSelectInput(categoryIndex)}
                      >
                        {capitalizeFirstLetter(elem.category)}
                      </span>
                    )}
                    {showDelete && (
                      <input
                        type="checkbox"
                        checked={elem.deleted}
                        name="category"
                        style={{
                          width: "22px",
                          height: "22px",
                          accentColor: "red",
                          cursor: "pointer",
                        }}
                        onChange={(e) => handleCheckboxChange(e, elem)}
                      />
                    )}
                  </div>
                  {elem.services.map((service, serviceIndex) => {
                    let lastService = elem.services.length - 1 === serviceIndex;
                    return (
                      <div
                        key={serviceIndex}
                        style={{
                          display: "flex",
                          width: "100%",
                          paddingTop: serviceIndex === 0 ? "5px" : 0,
                        }}
                      >
                        <hr
                          style={{
                            border: "1px solid",
                            width: "1px",
                            height: lastService ? "25px" : "40px",
                          }}
                        />
                        <hr
                          style={{
                            border: "1px solid",
                            transform: "rotateZ(90deg)",
                            margin: "19px 15px 10px 4px",
                            height: "10px",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {showEdit &&
                          selectedInput.categoryIndex === categoryIndex &&
                          selectedInput.serviceIndex === serviceIndex ? (
                            <input
                              type="text"
                              style={{
                                height: "30px",
                                width: "50%",
                                marginBottom: "2px",
                                fontFamily: "Jost, sans serif",
                                fontWeight: "bold",
                                fontSize: "17px",
                                border: "2px solid",
                                borderRadius: "4px",
                                paddingLeft: "2px",
                              }}
                              value={service.name}
                              onChange={(e) =>
                                handleServiceNameChange(
                                  categoryIndex,
                                  serviceIndex,
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span
                              style={{
                                width: "fit-content",
                                fontWeight: "bold",
                                backgroundColor: showEdit
                                  ? "lightgray"
                                  : "transparent",
                                borderRadius: "3px",
                                cursor: showEdit ? "pointer" : "default",
                                padding: "4px",
                              }}
                              onClick={() =>
                                handleSelectInput(categoryIndex, serviceIndex)
                              }
                            >
                              {service.name}
                            </span>
                          )}
                          {showDelete && (
                            <input
                              type="checkbox"
                              checked={service.deleted}
                              style={{
                                width: "22px",
                                height: "22px",
                                accentColor: "red",
                                cursor: "pointer",
                              }}
                              onChange={(e) =>
                                handleCheckboxChange(e, elem, service.name)
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </section>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "15px",
            }}
          >
            <div style={{ display: "flex" }}>
              {showDelete === false ? (
                <Button
                  onClick={() => {
                    setShowDelete(true);
                    setShowEdit(false);
                    setSelectedInput({
                      categoryIndex: null,
                      serviceIndex: null,
                    });
                  }}
                  disabled={showEdit ? true : false}
                  color="error"
                >
                  <DeleteRoundedIcon />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowDelete(false),
                      setEditableCatSer(categoryServices),
                      setServicesToDetele([]);
                  }}
                  variant="outlined"
                  style={{ border: "2px solid " }}
                  color="error"
                >
                  <h4 style={{ fontFamily: "Jost, sans-serif" }}>Descartar</h4>
                </Button>
              )}
            </div>

            <Button
              variant="contained"
              onClick={handleSaveCatSer}
              disabled={!showEdit && !showDelete ? true : false}
            >
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditServicesModal;
