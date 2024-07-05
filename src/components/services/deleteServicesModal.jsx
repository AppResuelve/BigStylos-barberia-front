import { useState } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { IconButton } from "@mui/material";
import closeBtn from "../../assets/icons/close.png";
import arrowBackBtn from "../../assets/icons/left-arrow.png";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DeleteServicesModal = ({
  categoryServices,
  openDelete,
  setOpenDelete,
  setRefreshServices,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [showConfirm, setShowConfirm] = useState(false);

  const handlesubmitDelete = async (product) => {
    try {
      const result = await axios.put(`${VITE_BACKEND_URL}/product/delete`, {
        name: product,
      });
          setRefreshServices((prevState) => {
            
      });
      setShowConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetShowConfirm = (index) => {
    setShowConfirm(index);
  };

  const handleClose = () => {
    setOpenDelete(false);
    setShowConfirm(false);
  };

  return (
    <>
      <Dialog
        fullScreen={sm ? true : false}
        fullWidth={true}
        maxWidth="xs"
        open={openDelete}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px",
          }}
        >
          <h2
            style={{
              display: "flex",
              margin: "10px",
              fontFamily: "PoiretOne",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Elimina categorias o servicios.
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
              alt=""
              style={{ width: "22px", height: "22px" }}
            />
          </IconButton>
        </Box>
        <hr />
        <DialogContent sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {categoryServices.map((elem, index) => {
              return (
                <div
                  key={index}
                  style={{
                    padding: "5px",
                    border: showConfirm === index ? "2px solid red" : "none",
                    borderRadius: "5px",
                    backgroundColor:
                      showConfirm === index ? "#fdbcbc" : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3>{elem.category}</h3>
                    <IconButton
                      onClick={() => handleSetShowConfirm(index)}
                      disabled={showConfirm === index ? true : false}
                      sx={{ width: "40px", height: "40px", color: "red" }}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Box>
                  {showConfirm === index && (
                    <Box
                      style={{
                        borderTop: "1px solid",
                      }}
                    >
                      <h3 style={{ margin: "5px" }}>
                        Esta operación es destructiva, desea continuar?
                      </h3>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <IconButton onClick={() => setShowConfirm(false)}>
                          <img
                            src={arrowBackBtn}
                            style={{ width: "25px", height: "25px" }}
                            alt=""
                          />
                        </IconButton>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handlesubmitDelete(product)}
                        >{`Eliminar ${elem.category}`}</Button>
                      </Box>
                    </Box>
                  )}
                </div>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        ></DialogActions>
      </Dialog>
    </>
  );
};
export default DeleteServicesModal;
