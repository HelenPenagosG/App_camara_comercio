import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
} from "react-leaflet";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Drawer,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

import "leaflet/dist/leaflet.css";
import L from "leaflet";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const { BaseLayer, Overlay } = LayersControl;

// 🔮 Datos simulados por capa
const riesgoPorCapa = {
  general: {
    "Suba": 0.75, "Engativa": 0.45, "Usaquen": 0.2, "Kennedy": 0.7, "Ciudad Bolivar": 0.91,
    "Chapinero": 0.33, "Bosa": 0.68, "Teusaquillo": 0.25, "Santa Fe": 0.6,
    "Tunjuelito": 0.5, "Rafael Uribe Uribe": 0.48, "Antonio Nariño": 0.4,
    "Puente Aranda": 0.36, "Candelaria": 0.25, "Sumapaz": 0.1, "Los Martires": 0.5, "Usme": 0.85,
    "San Cristobal": 0.65, "Fontibon": 0.55, "Barrios Unidos": 0.38,
  },
  percepcion: {
    "Suba": 0.9, "Engativa": 0.65, "Usaquen": 0.3, "Kennedy": 0.88, "Ciudad Bolivar": 0.95,
    "Chapinero": 0.45, "Bosa": 0.7, "Teusaquillo": 0.3, "Santa Fe": 0.8,
    "Tunjuelito": 0.6, "Rafael Uribe Uribe": 0.55, "Antonio Nariño": 0.5,
    "Puente Aranda": 0.35, "Candelaria": 0.3, "Sumapaz": 0.2, "Los Martires": 0.4, "Usme": 0.82,
    "San Cristobal": 0.78, "Fontibon": 0.68, "Barrios Unidos": 0.4,
  },
  victimizacion: {
    "Suba": 0.45, "Engativa": 0.4, "Usaquen": 0.25, "Kennedy": 0.78, "Ciudad Bolivar": 0.88,
    "Chapinero": 0.3, "Bosa": 0.62, "Teusaquillo": 0.2, "Santa Fe": 0.6,
    "Tunjuelito": 0.58, "Rafael Uribe Uribe": 0.5, "Antonio Nariño": 0.42,
    "Puente Aranda": 0.3, "Candelaria": 0.28, "Sumapaz": 0.18, "Los Martires": 0.35, "Usme": 0.75,
    "San Cristobal": 0.7, "Fontibon": 0.5, "Barrios Unidos": 0.33,
  },
  genero: {
    "Suba": 0.65, "Engativa": 0.5, "Usaquen": 0.2, "Kennedy": 0.79, "Ciudad Bolivar": 0.87,
    "Chapinero": 0.4, "Bosa": 0.68, "Teusaquillo": 0.3, "Santa Fe": 0.6,
    "Tunjuelito": 0.5, "Rafael Uribe Uribe": 0.52, "Antonio Nariño": 0.43,
    "Puente Aranda": 0.31, "Candelaria": 0.38, "Sumapaz": 0.22, "Los Martires": 0.48, "Usme": 0.72,
    "San Cristobal": 0.73, "Fontibon": 0.63, "Barrios Unidos": 0.45,
  }
};

// Explicaciones incluyendo factores de género
const explicacionPorLocalidad = {
  "Suba": [
    { variable: "Percepción de inseguridad femenina", impacto: 0.35 },
    { variable: "Victimización empresarial", impacto: 0.25 },
    { variable: "Brecha de género", impacto: 0.2 }
  ],
  "Kennedy": [
    { variable: "Denuncias ciudadanas", impacto: 0.28 },
    { variable: "Inseguridad estructural", impacto: 0.22 },
    { variable: "Violencia basada en género", impacto: 0.2 }
  ],
  "Ciudad Bolivar": [
    { variable: "Estigmatización mediática", impacto: 0.32 },
    { variable: "Falta de redes de apoyo", impacto: 0.27 },
    { variable: "Delitos sexuales reportados", impacto: 0.2 }
  ]
};

// Estilo visual
const getColor = (v) => v > 0.8 ? "#B71C1C" : v > 0.6 ? "#E53935" : v > 0.4 ? "#FB8C00" : v > 0.2 ? "#FDD835" : "#C8E6C9";
const getStyle = (nombre, capa) => ({
  fillColor: getColor(riesgoPorCapa[capa][nombre] || 0),
  weight: 1.5,
  color: "white",
  dashArray: "3",
  fillOpacity: 0.75,
});

// 🟣 Estilo UPZ
const getColorUPZ = (v) => v > 0.8 ? "#6A1B9A" : v > 0.6 ? "#8E24AA" : v > 0.4 ? "#BA68C8" : "#E1BEE7";
const upzStyle = (feature) => ({
  fillColor: getColorUPZ(feature.properties.riesgo_upz || 0),
  weight: 1.2,
  color: "#ffffff",
  fillOpacity: 0.7,
});

export default function MapaPage() {
  const [geoData, setGeoData] = useState(null);
  const [upzGeoData, setUpzGeoData] = useState(null);
  const [eventosCriticos, setEventosCriticos] = useState(null);

  const [selectedLoc, setSelectedLoc] = useState(null);
  const [layerActiva, setLayerActiva] = useState("general");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/localidades_convertido.geojson").then((res) => res.json()).then(setGeoData);
    fetch("/data/upz_simuladas.geojson").then((res) => res.json()).then(setUpzGeoData);
    fetch("/data/eventos_criticos.geojson").then((res) => res.json()).then(setEventosCriticos);
  }, []);

  const onEachFeatureByCapa = (capa) => (feature, layer) => {
    const nombre = feature.properties.NOMBRE;
    const riesgo = riesgoPorCapa[capa][nombre];
    layer.bindPopup(`<b>${nombre}</b><br/>Riesgo (${capa}): <strong>${riesgo ?? "Sin datos"}</strong>`);
    layer.on({
      click: () => setSelectedLoc(nombre),
      mouseover: (e) => e.target.setStyle({ weight: 3, color: "#333", fillOpacity: 0.9 }),
      mouseout: (e) => e.target.setStyle(getStyle(nombre, capa)),
    });
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ backgroundColor: "#DA1E3C" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mapa de Riesgo por Localidad
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, position: "relative" }}>
        {layerActiva === "genero" && (
          <Alert severity="info" sx={{ position: "absolute", top: 10, right: 20, zIndex: 1000, bgcolor: "#f3e5f5", color: "#4a148c" }}>
            En esta capa se muestra el riesgo relacionado con desigualdad y violencia de género. Áreas más oscuras indican mayor afectación.
          </Alert>
        )}

        <MapContainer center={[4.61, -74.08]} zoom={12} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoData && (
            <LayersControl position="topright">
              {Object.keys(riesgoPorCapa).map((capa, i) => (
                <BaseLayer
                  key={i}
                  checked={capa === "general"}
                  name={capa.charAt(0).toUpperCase() + capa.slice(1)}
                >
                  <GeoJSON
                    data={geoData}
                    style={(f) => getStyle(f.properties.NOMBRE, capa)}
                    onEachFeature={onEachFeatureByCapa(capa)}
                    eventHandlers={{
                      add: () => setLayerActiva(capa),
                    }}
                  />
                </BaseLayer>
              ))}

              <Overlay name="Zonas internas (Suba)">
                {upzGeoData && (
                  <GeoJSON
                    data={upzGeoData}
                    style={upzStyle}
                    onEachFeature={(feature, layer) => {
                      const props = feature.properties;
                      layer.bindPopup(`<b>${props.UPZ}</b><br/>Riesgo interno: <strong>${props.riesgo_upz}</strong>`);
                    }}
                  />
                )}
              </Overlay>
              <Overlay name="Alertas críticas recientes">
  {eventosCriticos && (
    <GeoJSON
      data={eventosCriticos}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#FF5722",
          color: "#FF7043",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.9,
        })
      }
      onEachFeature={(feature, layer) => {
        const { tipo, descripcion, fecha } = feature.properties;
        layer.bindPopup(`
          <b>Alerta:</b> ${tipo}<br/>
          <b>Descripción:</b> ${descripcion}<br/>
          <b>Fecha:</b> ${fecha}
        `);
      }}
    />
  )}
</Overlay>

            </LayersControl>
          )}
        </MapContainer>
        

        {/* Leyenda */}
        <Paper elevation={3} sx={{ position: "absolute", bottom: 20, right: 20, bgcolor: "white", p: 2, zIndex: 1000 }}>
          <Typography variant="subtitle2" gutterBottom>Leyenda de riesgo</Typography>
          {[["#B71C1C", "Muy alto (> 0.8)"], ["#E53935", "Alto (> 0.6)"], ["#FB8C00", "Medio (> 0.4)"], ["#FDD835", "Bajo (> 0.2)"], ["#C8E6C9", "Muy bajo (≤ 0.2)"]].map(([color, label], i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: color }} />
              <Typography variant="caption">{label}</Typography>
            </Box>
          ))}
        </Paper>

        {/* Panel lateral */}
        <Drawer anchor="right" open={Boolean(selectedLoc)} onClose={() => setSelectedLoc(null)}>
          <Box sx={{ width: 280, p: 2, display: "flex", flexDirection: "column", gap: 2, bgcolor: "#f9f9f9" }}>
            <Typography variant="h6" sx={{ color: "#DA1E3C", fontWeight: "bold" }}>{selectedLoc}</Typography>
            <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Índice general</Typography>
              <Typography variant="h4" sx={{ color: getColor(riesgoPorCapa.general[selectedLoc] ?? 0), fontWeight: "bold" }}>
                {riesgoPorCapa.general[selectedLoc] ?? "–"}
              </Typography>
              <Typography variant="body2" color="text.secondary">Riesgo estimado a partir del modelo.</Typography>
            </Box>

            {explicacionPorLocalidad[selectedLoc] ? (
              <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Factores principales</Typography>
                <Bar
                  data={{
                    labels: explicacionPorLocalidad[selectedLoc].map((v) => v.variable),
                    datasets: [{
                      label: "Impacto",
                      data: explicacionPorLocalidad[selectedLoc].map((v) => v.impacto),
                      backgroundColor: "#DA1E3C",
                    }],
                  }}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { x: { min: 0, max: 0.5 } },
                  }}
                />
                {selectedLoc && riesgoPorCapa.genero[selectedLoc] > 0.6 && (
  <Paper
    elevation={3}
    sx={{
      position: "absolute",
      bottom: 140,
      right: 20,
      width: 220,
      zIndex: 1200,
      backgroundColor: "#fce4ec",
      borderLeft: "6px solid #AD1457",
      p: 2,
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#AD1457" }}>
      Perspectiva de género en {selectedLoc}
    </Typography>
    <Typography variant="body2" sx={{ mt: 1, color: "#6A1B9A" }}>
      En esta localidad se evidencia una alta percepción de inseguridad en las mujeres lo que sugiere la necesidad de intervenciones con enfoque de género.
    </Typography>
  </Paper>
)}

              </Box>
            ) : (
              <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Aún no hay datos explicativos para esta localidad.
                </Typography>
              </Box>
            )}
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}
