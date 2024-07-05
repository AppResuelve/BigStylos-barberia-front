const handleEdit = () => {
  setShowEdit(true);
};

const handleCancel = () => {
  setShowEdit(false);
};

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
        style={{ borderRadius: "50px", border: "2px solid " }}
      >
        <h4 style={{ fontFamily: "Jost, sans-serif" }}>Descartar</h4>
      </Button>
    )}
    <Button
      disabled={showEdit ? true : false}
      onClick={handleOpenDelete}
      color="error"
    >
      <DeleteRoundedIcon />
    </Button>
    <DeleteServicesModal
      categoryServices={categoryServices}
      openDelete={openDelete}
      setOpenDelete={setOpenDelete}
      setRefreshServices={setRefreshServices}
    />
  </div>
  {showEdit === true && (
    <Button /* onClick={handleSubmit} */ variant="contained">
      <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
    </Button>
  )}
</Box>;
