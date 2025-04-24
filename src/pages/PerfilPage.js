import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Button,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 🧠 Cálculo de riesgo con énfasis en victimización
const calcularRiesgo = (empresa) => {
  const pesos = {
    percepcion: 0.2,
    victima: 0.35,
    genero: 0.15,
    prevencion: -0.1,
    denuncia: -0.05,
  };

  const score =
    (empresa.percepcion * pesos.percepcion) +
    (empresa.victima ? pesos.victima : 0) +
    (empresa.genero === "Mujer" ? pesos.genero : 0) +
    (empresa.prevencion ? pesos.prevencion : 0) +
    (empresa.denuncia ? pesos.denuncia : 0);

  return Math.min(Math.max(score, 0), 1);
};

const getNivelRiesgo = (valor) => {
  if (valor > 0.8) return { label: "Muy Alto", color: "#B71C1C", recomendacion: "Reforzar medidas y acompañamiento institucional." };
  if (valor > 0.6) return { label: "Alto", color: "#E53935", recomendacion: "Evaluar estrategias de mitigación del riesgo." };
  if (valor > 0.4) return { label: "Medio", color: "#FB8C00", recomendacion: "Fortalecer cultura organizacional y prevención." };
  if (valor > 0.2) return { label: "Bajo", color: "#FDD835", recomendacion: "Monitorear situación y mantener buenas prácticas." };
  return { label: "Muy Bajo", color: "#C8E6C9", recomendacion: "Compartir buenas prácticas con otras empresas." };
};

export default function PerfilPage() {
  const [empresa, setEmpresa] = useState({
    nombre: "",
    sector: "Comercio",
    percepcion: 3,
    genero: "Mujer",
    victima: false,
    prevencion: true,
    denuncia: true,
    presenciaMujeres: 60,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setEmpresa({ ...empresa, [name]: checked });
  };

  const riesgo = calcularRiesgo(empresa);
  const nivel = getNivelRiesgo(riesgo);
  const promedioSector = 0.55;

  const mostrarAlertaGenero = () => {
    const porcentaje = parseInt(empresa.presenciaMujeres);

    if (porcentaje >= 60) {
      return (
        <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: "#fce4ec", borderLeft: "6px solid #AD1457" }}>
          <Typography variant="subtitle1" sx={{ color: "#AD1457", fontWeight: "bold" }}>
            Alta representación femenina
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            La empresa cuenta con una alta proporción de mujeres. Se recomienda fortalecer protocolos de prevención de acoso, violencia de género y brindar espacios seguros para el desarrollo profesional femenino.
          </Typography>
        </Paper>
      );
    }

    if (porcentaje >= 30 && porcentaje < 60) {
      return (
        <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: "#fff3e0", borderLeft: "6px solid #FB8C00" }}>
          <Typography variant="subtitle1" sx={{ color: "#E65100", fontWeight: "bold" }}>
            Representación intermedia de mujeres
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            La empresa podría beneficiarse de acciones inclusivas que promuevan mayor representación y bienestar para mujeres, incluyendo estrategias de liderazgo y protección frente a riesgos diferenciales.
          </Typography>
        </Paper>
      );
    }

    if (porcentaje < 30) {
      return (
        <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: "#e8f5e9", borderLeft: "6px solid #388E3C" }}>
          <Typography variant="subtitle1" sx={{ color: "#2E7D32", fontWeight: "bold" }}>
            Baja participación femenina
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Se recomienda revisar prácticas internas que puedan estar limitando la participación de mujeres y considerar programas que promuevan la diversidad e inclusión en los equipos.
          </Typography>
        </Paper>
      );
    }

    return null;
  };

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", py: 6, minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" color="#DA1E3C" gutterBottom>
          Evaluación de Riesgo Empresarial
        </Typography>

        <Button variant="outlined" onClick={() => navigate("/")} sx={{ mb: 3 }}>
          ← Volver al inicio
        </Button>

        {/* Formulario */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Datos de la empresa</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth name="nombre" label="Nombre de la empresa" value={empresa.nombre} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth name="sector" label="Sector" value={empresa.sector} onChange={handleChange}>
                <MenuItem value="Comercio">Comercio</MenuItem>
                <MenuItem value="Servicios">Servicios</MenuItem>
                <MenuItem value="Industrial">Industrial</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth name="genero" label="Género del Representante" value={empresa.genero} onChange={handleChange}>
                <MenuItem value="Mujer">Mujer</MenuItem>
                <MenuItem value="Hombre">Hombre</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" name="presenciaMujeres" label="% de mujeres en la empresa" inputProps={{ min: 0, max: 100 }} value={empresa.presenciaMujeres} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" name="percepcion" label="Percepción de Inseguridad (1-5)" inputProps={{ min: 1, max: 5 }} value={empresa.percepcion} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch name="victima" checked={empresa.victima} onChange={handleToggle} />} label="¿Ha sido víctima de delitos?" />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch name="prevencion" checked={empresa.prevencion} onChange={handleToggle} />} label="¿Tiene sistema de prevención?" />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch name="denuncia" checked={empresa.denuncia} onChange={handleToggle} />} label="¿Canales de denuncia?" />
            </Grid>
          </Grid>
        </Paper>

        {/* Riesgo */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Nivel de Riesgo Estimado</Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color: nivel.color }}>
            {nivel.label}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Valor estimado: {(riesgo * 100).toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Comparado con el promedio del sector ({(promedioSector * 100).toFixed(1)}%), tu empresa presenta un{" "}
            {riesgo > promedioSector ? "riesgo mayor" : "riesgo menor"}.
          </Typography>
        </Paper>

        {/* Gráfico de impacto */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Variables que más contribuyen</Typography>
          <Box sx={{ height: 300 }}>
            <Bar
              data={{
                labels: [
                  "Percepción de inseguridad",
                  "Ha sido víctima",
                  "Género representante",
                  "Sistema prevención",
                  "Canal denuncia",
                ],
                datasets: [{
                  label: "Impacto",
                  data: [
                    empresa.percepcion * 0.2,
                    empresa.victima ? 0.35 : 0,
                    empresa.genero === "Mujer" ? 0.15 : 0,
                    empresa.prevencion ? -0.1 : 0,
                    empresa.denuncia ? -0.05 : 0,
                  ],
                  backgroundColor: "#DA1E3C",
                }],
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { x: { min: -0.15, max: 0.5 } },
              }}
            />
          </Box>
        </Paper>

        {/* Recomendación general */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Recomendación</Typography>
          <Typography variant="body2" color="text.secondary">{nivel.recomendacion}</Typography>
        </Paper>

        {/* 🔺 Recomendación por género y participación femenina */}
        {mostrarAlertaGenero()}
      </Container>
    </Box>
  );
}
