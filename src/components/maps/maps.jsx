import { useContext, useState } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import Map, { Marker, Popup } from "react-map-gl";
import "./map.css";
import { DarkModeContext } from "../../App";

const VITE_MAPBOX_MAPS_API_KEY = import.meta.env.VITE_MAPBOX_MAPS_API_KEY;

const Maps = () => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(DarkModeContext);

  const [viewport, setViewport] = useState({
    longitude: -58.994893588103295,
    latitude: -27.467508847351258,
    zoom: 12,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerClick = () => {
    setSelectedMarker({
      longitude: -58.994893588103295,
      latitude: -27.467508847351258,
      info: {
        name: "Stylos Barber",
        address: "Calle Falsa 123, Ciudad Ejemplo",
      },
    });
  };

  const handleClosePopup = () => {
    setSelectedMarker(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <Map
        mapboxAccessToken={VITE_MAPBOX_MAPS_API_KEY}
        initialViewState={viewport}
        style={{
          width: "100%",
          height: sm ? "400px" : "300px",
          boxShadow: "0px 0px 10px 0px rgb(0,0,0,0.5)",
          borderRadius: "16px",
        }}
        mapStyle={
          darkMode.on
            ? "mapbox://styles/mapbox/dark-v10"
            : "mapbox://styles/mapbox/streets-v12"
        }
      >
        <Marker
          longitude={-58.994893588103295}
          latitude={-27.467508847351258}
          anchor="bottom"
          color="#da0000"
          onClick={handleMarkerClick}
        />

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            closeOnClick={false}
            onClose={handleClosePopup}
            className="custom-popup" // Aplica la clase personalizada
          >
            <div>
              <h3>{selectedMarker.info.name}</h3>
              <p>{selectedMarker.info.address}</p>
            </div>
          </Popup>
        )}
      </Map>
      <a
        className="btn-to-maps"
        style={{
          color: darkMode.on ? "white" : "black",
          backgroundColor: darkMode.on ? darkMode.dark : "white",
        }}
        href="https://www.google.com/maps/place/Big+Stylo's/@-27.4676205,-58.9953126,19.17z/data=!4m10!1m3!2m2!1speluquerias!6e1!3m5!1s0x94450d77093da511:0x86fdba6ac187d301!8m2!3d-27.4674811!4d-58.9948704!16s%2Fg%2F11v0y3snbw?entry=ttu"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir en maps
      </a>
    </div>
  );
};

export default Maps;
