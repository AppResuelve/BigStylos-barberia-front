import { Grid } from "@mui/material";

const Footer = () => {
  return (
    <Grid
      container
      style={{
        height: "80px",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        alignContent: "center",
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        Dirección: Alberdi 1034, Bs As, Argentina.
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        style={{ display: "flex", justifyContent: "center" }}
      >
        All rights reserved 2023.
      </Grid>
    </Grid>
  );
};
export default Footer;
