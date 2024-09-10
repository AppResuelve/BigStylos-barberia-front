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
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [servicesToDelete, setServicesToDetele] = useState([]);

  const handleDeleteCatSer = async () => {
    Swal.fire({
      title:
        "Estas a punto de borrar servicios o categorias. Deseas continuar?",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Borrar",
      denyButtonText: "Más tarde",
      customClass: {
        container: "my-swal-container",
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
              container: "my-swal-container",
            },
          });
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
        }}
      >
        <div className="body-DeleteServicesModal">
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
                        accentColor: "red",
                        cursor: "pointer",
                      }}
                      checked={elem.deleted}
                      onChange={(e) => e.stopPropagation()}
                    />
                  </div>
                  <hr />
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
                          className="div-service-DelServiceModal"
                          onClick={() =>
                            handleCheckboxChange(
                              {
                                target: { checked: !service.deleted, name: "" },
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
                              accentColor: "red",
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
        <footer className="footer-DeleteServicesModal">
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
            sx={{
              fontFamily: "Jost",
              letterSpacing: "1px",
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

/* <label className="container-checkbox"> */
/* <div
    className="checkmark"
   ></div>
   </label> */
