import { useContext, useState, useRef, useEffect } from "react";
import ThemeContext from "../../context/ThemeContext";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import Map, { Marker, Popup } from "react-map-gl";
import expandIcon from "../../assets/icons/expand.png";
import expandLessIcon from "../../assets/icons/expandless.png";
import "./map.css";
import { LoaderMapReady } from "../loaders/loaders";

const VITE_MAPBOX_MAPS_API_KEY = import.meta.env.VITE_MAPBOX_MAPS_API_KEY;

const Maps = () => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(ThemeContext);
  const { mapLoaded, setMapLoaded } = useContext(LoadAndRefreshContext);
  const [expandMap, setExpandMap] = useState(false);
  const [viewport, setViewport] = useState({
    longitude: -58.994893588103295,
    latitude: -27.467508847351258,
    zoom: 12,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null); // Referencia al mapa

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize(); // Llama a resize cuando cambias el tamaño
    }
  }, [expandMap, sm]); // Ejecuta esto cuando se expande o cambia el tamaño

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

  const handleMapLoad = () => {
    setMapLoaded(true); // Establece el estado como cargado
  };

  return (
    <div
      style={{
        position: "relative",
        height: sm && expandMap ? "400px" : sm ? "200px" : "300px",
      }}
    >
      {!mapLoaded && <LoaderMapReady />}
      <>
        <Map
          ref={mapRef} // Asigna la referencia al mapa
          mapboxAccessToken={VITE_MAPBOX_MAPS_API_KEY}
          initialViewState={viewport}
          style={{
            width: "100%",
            height: "100%",
            boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.50)",
            borderRadius: "16px",
          }}
          mapStyle={
            darkMode.on
              ? "mapbox://styles/mapbox/dark-v10"
              : "mapbox://styles/mapbox/streets-v12"
          }
          onLoad={handleMapLoad} // Evento que detecta cuando el mapa está cargado
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
              className="custom-popup"
            >
              <div>
                <h3>{selectedMarker.info.name}</h3>
                <p>{selectedMarker.info.address}</p>
              </div>
            </Popup>
          )}
        </Map>
        {!sm ? null : !expandMap ? (
          <button className="btn-to-expand" onClick={() => setExpandMap(true)}>
            <img src={expandIcon} alt="expandir" />
          </button>
        ) : (
          <button className="btn-to-expand" onClick={() => setExpandMap(false)}>
            <img src={expandLessIcon} alt="contraer" />
          </button>
        )}
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
      </>
    </div>
  );
};

export default Maps;
