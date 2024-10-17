import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const InputTel = ({
  newPhoneNumber,
  setNewPhoneNumber,
  setInputTelError,
  userData,
}) => {
  const [country, setCountry] = useState("ar"); // país predeterminado

  useEffect(() => {
    if (userData !== undefined && userData !== 1)
      setNewPhoneNumber(userData.phone);
  }, [userData]);

  const handleKeyDown = (e) => {
    // Manejar el evento cuando se presiona Enter
    if (e.keyCode === 13) {
      e.preventDefault(); // Evitar que se agregue un salto de línea en el Input
      handleUpdatePhone();
    }
  };
  const handleChangePhone = (value, countryData) => {
    console.log(countryData);
    
    setNewPhoneNumber(value);
    setCountry(countryData.countryCode);
    validatePhone(value, countryData.countryCode);
  };

  const validatePhone = (value, countryCode) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(
        value,
        countryCode.toUpperCase()
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        setInputTelError("El número de teléfono no es válido.");
      } else {
        setInputTelError("");
      }
    } catch (inputTelError) {
      setInputTelError("El número de teléfono no es válido.");
    }
  };

  return (
    <PhoneInput
      inputProps={{
        name: "phone",
        required: true,
        autoFocus: true,
      }}
      country={country}
      value={newPhoneNumber}
      onChange={handleChangePhone}
      onKeyDown={handleKeyDown}
      enableSearch={true}
      inputStyle={{
        width: "100%",
        height: "45px",
        fontFamily: "Jost",
        fontWeight: "bold",
        fontSize: "18px",
        marginBottom: "5px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-color-secondary)",
        color: "var(--text-color)",
      }}
      dropdownStyle={{
        borderRadius: "10px", // Bordes redondeados del dropdown
        maxHeight: "140px", // Altura máxima del dropdown
        backgroundColor: "var(--bg-color)", // Color de fondo del dropdown
      }}
      searchStyle={{
        display: "flex",
        width: "100%",
        marginLeft: "-5px",
        borderRadius: "5px", // Bordes redondeados
        fontSize: "16px", // Tamaño de fuente

        border: "1px solid var(--accent-color)", // Borde del campo de búsqueda
      }}
    />
  );
};

export default InputTel;
