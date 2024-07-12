import { useState } from "react";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import Map, { Marker, Popup } from "react-map-gl";
import "./map.css"; // Importa tu archivo de estilos

const VITE_MAPBOX_MAPS_API_KEY = import.meta.env.VITE_MAPBOX_MAPS_API_KEY;

const Maps = () => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
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
    <Map
      mapboxAccessToken={VITE_MAPBOX_MAPS_API_KEY}
      initialViewState={viewport}
      style={{
        width: "100%",
        height: sm ? "600px" : "400px",
        boxShadow: "0px 0px 10px 0px rgb(0,0,0,0.5)",
        borderRadius: "16px",
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
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
  );
};

export default Maps;
