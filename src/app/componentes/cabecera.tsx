"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Button from "@mui/material/Button";
import Buscador from "./buscador";
import ModalProducto from "./ModalProducto";
import Box from "@mui/material/Box";

interface CabeceraProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onToggleDrawer: () => void;

}

const Cabecera: React.FC<CabeceraProps> = ({ darkMode, toggleDarkMode, onToggleDrawer }) => {
  const [openModal, setOpenModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          left: 0,
          background: "linear-gradient(90deg, #350076ff 0%, #df006cff 70%, #df6100ff 100%)",
          zIndex: 1300,

        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Izquierda: Título + Buscador */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">CRUD</Typography>
              <IconButton color="inherit" onClick={onToggleDrawer}>
            <MenuIcon />
          </IconButton>
          </Box>
       <Box sx={{ width: 300 }}>
              <Buscador />
            </Box>
          {/* Derecha: Botones */}
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="gradient"
              color="inherit"
              onClick={() => setOpenModal(true)}
            >
              Nuevo Producto
            </Button>

            <IconButton color="inherit" onClick={handleFullscreen}>
              {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>

            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <ModalProducto open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default Cabecera;
