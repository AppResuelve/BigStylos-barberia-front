import { useState } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { IconButton } from "@mui/material";
import closeBtn from "../../assets/icons/close.png";
import { Dialog, Button } from "@mui/material";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import Swal from "sweetalert2";
import axios from "axios";
import "./services.css";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DeleteServicesModal = ({
  categoryServices,
  editableCatSer,
  setEditableCatSer,
  openDelete,
  setOpenDelete,
  setRefreshServices,
  setRefreshStatusSession,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [servicesToDelete, setServicesToDetele] = useState([]);

  const handleDeleteCatSer = async () => {
    Swal.fire({
      title: "Esta acción es destructiva. Deseas continuar?",
      icon: "error",
      showDenyButton: true,
      denyButtonText: "Descartar",
      confirmButtonText: "Continuar",
      reverseButtons: true,
      backdrop: `rgba(0,0,0,0.8)`,
      customClass: {
        backdrop: "custom-backdrop-swal",
        container: "custom-swal-container",
        popup: "custom-swal-modal",
        actions: "swal2-actions",
        confirmButton: "custom-confirm-button-error",
        denyButton: "custom-deny-button",
        icon: "custom-icon-swal",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/services/delete`,
            {
              services: servicesToDelete,
            }
          );
          Swal.fire({
            title: `Los servicios y/o categorias han sido borrados exitosamente. `,
            icon: "success",
            timer: 3000,
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            showCloseButton: true,
            customClass: {
              container: "custom-swal-container",
            },
          });
          setRefreshStatusSession((prevState) => !prevState);
          //en vez de hacer refresh se puede setear los estados servicios
          //con el result.(luego de ejecutar la funcion convertCategoryService)
          setRefreshServices((prevState) => {
            let copyState = !prevState;
            return copyState;
          });

          if (Object.keys(response.data.services).length < 1) {
            handleClose();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleClose = () => {
    setOpenDelete(false);
    setServicesToDetele([]);
    setEditableCatSer(categoryServices);
  };

  const handleCheckboxChange = (e, category, serviceName) => {
    const categoryName = category.category;
    const checked = e.target.checked;

    // Actualizar servicios a eliminar
    setServicesToDetele((prevState) => {
      let updatedState = [...prevState];

      if (serviceName === undefined) {
        // Manejar el checkbox de la categoría
        if (checked) {
          // Agregar todos los servicios de la categoría si se selecciona
          category.services.forEach((service) => {
            if (!updatedState.includes(service.name)) {
              updatedState.push(service.name);
            }
          });
        } else {
          // Eliminar todos los servicios de la categoría si se deselecciona
          category.services.forEach((service) => {
            updatedState = updatedState.filter((serv) => serv !== service.name);
          });
        }
      } else {
        // Manejar el checkbox del servicio
        if (checked) {
          if (!updatedState.includes(serviceName)) {
            updatedState.push(serviceName);
          }
        } else {
          updatedState = updatedState.filter((serv) => serv !== serviceName);
        }
      }
      return updatedState;
    });

    // Actualizar el estado editable de categorías y servicios
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

  return (
    <Dialog
      fullScreen={sm ? true : false}
      sx={{ height: "100%" }}
      fullWidth={true}
      maxWidth="sm"
      open={openDelete}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-description"
    >
      {sm&&<div
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "var(--bg-color)",
        }}
      ></div>}
      <div className="container-dialog-DeleteServicesModal">
        <header className="header-DeleteServicesModal">
          <h1>Elimina categorias y/o servicios.</h1>
          <IconButton
            onClick={handleClose}
            variant="contained"
            sx={{
              width: "40px",
              height: "40px",
            }}
          >
            <img src={closeBtn} alt="cerrar" />
          </IconButton>
        </header>
        <hr />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            marginBottom: sm ? "0px" : "60px",
          }}
        >
          <div
            className="body-DeleteServicesModal"
            style={{
              overflowY: sm ? "" : "scroll",
              maxHeight: sm ? "" : "400px",
            }}
          >
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
              editableCatSer.map((elem, categoryIndex) => {
                return (
                  <section key={categoryIndex} style={{ marginBottom: "15px" }}>
                    <div
                      className="div-category-DelServiceModal"
                      onClick={() =>
                        handleCheckboxChange(
                          {
                            target: {
                              checked: !elem.deleted,
                              name: "category",
                            },
                          },
                          elem
                        )
                      }
                    >
                      <span>{capitalizeFirstLetter(elem.category)}</span>
                      <input
                        type="checkbox"
                        style={{
                          width: "22px",
                          height: "22px",
                          accentColor: "var(--color-error)",
                          cursor: "pointer",
                        }}
                        checked={elem.deleted}
                        onChange={(e) => e.stopPropagation()}
                      />
                    </div>
                    <hr />
                    {elem.services.map((service, serviceIndex) => {
                      let lastService =
                        elem.services.length - 1 === serviceIndex;
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
                              border: "2px solid var(--bg-color-medium)",
                              // width: "0px",
                              height: lastService ? "28px" : "40px",
                            }}
                          />
                          <hr
                            style={{
                              border: "2px solid var(--bg-color-medium)",
                              transform: "rotateZ(90deg)",
                              margin: "19px 15px 10px 2px",
                              height: "15px",
                            }}
                          />
                          <div
                            className="div-service-DelServiceModal"
                            onClick={() =>
                              handleCheckboxChange(
                                {
                                  target: {
                                    checked: !service.deleted,
                                    name: "",
                                  },
                                },
                                elem,
                                service.name
                              )
                            }
                          >
                            <span>{service.name}</span>
                            <input
                              type="checkbox"
                              style={{
                                width: "22px",
                                height: "22px",
                                accentColor: "var(--color-error)",
                                cursor: "pointer",
                              }}
                              checked={service.deleted}
                              onChange={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </section>
                );
              })
            )}
          </div>
        </div>
        <footer
          className="footer-DeleteServicesModal"
          style={{ position: sm ? "fixed" : "absolute" }}
        >
          <Button
            onClick={handleClose}
            sx={{
              fontFamily: "Jost",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            Descartar
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              fontFamily: "Jost",
              letterSpacing: "1px",
              bgcolor: "var(--color-error)",
            }}
            disabled={servicesToDelete.length > 0 ? false : true}
            onClick={handleDeleteCatSer}
          >
            Borrar
          </Button>
        </footer>
      </div>
    </Dialog>
  );
};

export default DeleteServicesModal;
