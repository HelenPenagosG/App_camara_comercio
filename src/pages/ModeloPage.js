import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import InfoIcon from "@mui/icons-material/Info";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ModeloPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#f7f7f7", py: 6, minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="#DA1E3C">
            Modelo Predictivo de Riesgo Empresarial
          </Typography>
          <Button onClick={() => navigate("/")} variant="outlined">
            ← Volver al inicio
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* OBJETIVO */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <TrackChangesIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Objetivo del modelo</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Predecir el nivel de riesgo empresarial en Bogotá a partir de encuestas ECN y fuentes externas,
                brindando una herramienta para la toma de decisiones con enfoque en seguridad, género y percepción.
              </Typography>
            </Paper>
          </Grid>

          {/* MODELO SELECCIONADO */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <PrecisionManufacturingIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Modelo seleccionado</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Utilizamos un modelo de tipo <strong>Random Forest</strong>, que permite predecir el índice de riesgo
                general basándose en múltiples variables con gran precisión.
              </Typography>
              <Typography variant="body2" fontStyle="italic">
                Se eligió por su capacidad para manejar no linealidades, evitar el sobreajuste y ofrecer interpretabilidad con SHAP.
              </Typography>
            </Paper>
          </Grid>

          {/* VARIABLES DE ENTRADA */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <InfoIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Variables de entrada al modelo</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <ul>
                    <li>Percepción de inseguridad</li>
                    <li>Victimización empresarial</li>
                    <li>Género del representante legal</li>
                    <li>Sistemas internos de prevención</li>
                  </ul>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ul>
                    <li>Uso de canales de denuncia</li>
                    <li>Sector económico</li>
                    <li>Información geográfica (por localidad)</li>
                    <li>Denuncias públicas en redes sociales</li>
                  </ul>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* INTERPRETABILIDAD */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">¿Cómo se interpreta el modelo?</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Utilizamos <strong>valores SHAP</strong> para estimar el impacto de cada variable en la predicción individual
                del índice de riesgo. A continuación, un ejemplo de cómo se visualiza:
              </Typography>
              <Bar
                data={{
                  labels: ["Victimización", "Percepción", "Género mujer", "Prevención", "Denuncia"],
                  datasets: [
                    {
                      label: "Importancia SHAP",
                      data: [0.28, 0.18, 0.12, -0.08, -0.1],
                      backgroundColor: "#DA1E3C",
                    },
                  ],
                }}
                options={{
                  indexAxis: "y",
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      min: -0.15,
                      max: 0.4,
                      title: {
                        display: true,
                        text: "Contribución al riesgo",
                      },
                    },
                  },
                }}
              />
            </Paper>
          </Grid>

          {/* RESULTADOS */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ¿Qué arroja el modelo?
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">📌 Índice de riesgo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Valor numérico entre 0 y 1. Se clasifica en cinco niveles: Muy bajo, Bajo, Medio, Alto y Muy alto.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">📊 Análisis explicativo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Se muestra al usuario qué variables influyeron más en su predicción y cómo se compara con su sector económico.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
