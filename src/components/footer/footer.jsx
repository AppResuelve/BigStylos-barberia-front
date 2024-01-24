import { Grid } from "@mui/material";

const Footer = ({darkMode}) => {
  return (
    <Grid
      container
      style={{
        width:"100%",
        height: "80px",borderRadius:"3px",
        backgroundColor: darkMode ? "white" : "#28292c",
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
          color: darkMode ? "#28292c" : "white",
        }}
      >
        Alberdi 1034, Bs As, Argentina.
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          marginTop:"10px",
          justifyContent: "center",
          color: darkMode ? "#28292c" : "white",
        }}
      >
        All rights reserved 2023.
      </Grid>
    </Grid>
  );
};
export default Footer;
