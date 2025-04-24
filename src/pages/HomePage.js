import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Fade,
} from "@mui/material";
import { Link } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";
import BusinessIcon from "@mui/icons-material/Business";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import logoCCB from "../assets/logo_ccb.png";
import logoDatanova from "../assets/logo_Datanova.png";

export default function HomePage() {
  return (
    <>
      {/* ENCABEZADO SUPERIOR */}
      <AppBar position="static" sx={{ backgroundColor: "#DA1E3C" }}>
        <Toolbar>
          <img src={logoCCB} alt="Logo CCB" style={{ width: 170, marginRight: 16 }} />
          <Box>
            <Typography variant="h6" component="div">
              Cámara de Comercio de Bogotá
            </Typography>
            <Typography variant="body2">Índice de riesgo empresarial</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" variant="outlined" sx={{ borderColor: "white", color: "white" }}>
            Iniciar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* ANIMACIÓN DE ENTRADA */}
      <Fade in timeout={800}>
        <Box>
          {/* SECCIÓN INSPIRADORA + LOGO DATANOVA */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #ffffff 0%, #f5f5f5 100%)",
              py: 6,
            }}
          >
            <Container maxWidth="md">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  flexWrap: "wrap",
                  textAlign: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Ciencia de datos con propósito
                  </Typography>
                  <Typography variant="body1" color="text.secondary" maxWidth={500} mx="auto">
                    Un proyecto desarrollado por mujeres para visibilizar la relación entre seguridad,
                    género y territorio en el entorno empresarial.
                  </Typography>
                  <Button
                    component={Link}
                    to="/mapa"
                    variant="contained"
                    sx={{
                      mt: 4,
                      backgroundColor: "#DA1E3C",
                      "&:hover": { backgroundColor: "#b6162f" },
                    }}
                  >
                    Explorar Mapa de riesgo
                  </Button>
                </Box>
                <img
                  src={logoDatanova}
                  alt="Logo Datanova"
                  style={{ height: 220, marginTop: 16 }}
                />
              </Box>
            </Container>
          </Box>

          {/* LOGO CCB ANTES DE LAS TARJETAS */}
          <Box sx={{ textAlign: "center", py: 2 }}>
            <img src={logoCCB} alt="Logo CCB" style={{ height: 80 }} />
          </Box>

          {/* TARJETAS */}
          <Container sx={{ pb: 6 }}>
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  title: "Mapa de calor",
                  desc: "Visualiza zonas críticas de riesgo empresarial según delitos y percepción.",
                  icon: <MapIcon color="error" fontSize="large" />,
                  path: "/mapa",
                },
                {
                  title: "Perfil empresarial",
                  desc: "Consulta el nivel de exposición al riesgo según zona, tipo de empresa y género.",
                  icon: <BusinessIcon color="error" fontSize="large" />,
                  path: "/perfil",
                },
                {
                  title: "Análisis de género y seguridad",
                  desc: "Explora relaciones entre delitos, género y percepción de inseguridad.",
                  icon: <InsightsIcon color="error" fontSize="large" />,
                  path: "/genero",
                },
                {
                  title: "Modelo y datos",
                  desc: "Descubre cómo se alimenta el índice con fuentes externas y sociales.",
                  icon: <SettingsIcon color="error" fontSize="large" />,
                  path: "/modelo",
                },
              ].map((card, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Fade in timeout={600 + i * 200}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: 3,
                      }}
                      elevation={4}
                    >
                      <CardContent>
                        <Box sx={{ mb: 2 }}>{card.icon}</Box>
                        <Typography variant="h6" gutterBottom>
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.desc}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={Link}
                          to={card.path}
                          size="small"
                          sx={{ color: "#DA1E3C", fontWeight: "bold" }}
                        >
                          Ver más
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* DATO DESTACADO */}
          <Box sx={{ backgroundColor: "#fff", py: 8 }}>
            <Container maxWidth="sm" sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" color="#DA1E3C" gutterBottom>
                ¿Sabías que...?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Aunque el <strong>69%</strong> de los empresarios considera a Bogotá insegura para hacer negocios,{" "}
                solo el <strong>16%</strong> de las empresas ha sufrido un delito.
              </Typography>
            </Container>
          </Box>
        </Box>
      </Fade>

      {/* PIE DE PÁGINA */}
      <Box sx={{ textAlign: "center", py: 4, backgroundColor: "#f1f1f1", mt: "auto" }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 Cámara de Comercio de Bogotá · Proyecto académico sin fines comerciales
        </Typography>
      </Box>
    </>
  );
}
