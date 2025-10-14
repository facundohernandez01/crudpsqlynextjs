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
  userName?: string;
  authButton?: React.ReactNode;
  onNuevoProducto?: () => void;
}

const Cabecera: React.FC<CabeceraProps> = ({
  darkMode,
  toggleDarkMode,
  onToggleDrawer,
  userName,
  authButton,
  onNuevoProducto,
}) => {
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
      <AppBar position="fixed" >
        <Toolbar sx={{ justifyContent: "space-between" }}>
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
              onClick={onNuevoProducto}
            >
              Nuevo Producto
            </Button>
            <IconButton color="inherit" onClick={handleFullscreen}>
              {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {/* MSAL Auth */}
            {authButton}
          </Box>
        </Toolbar>
      </AppBar>
      <ModalProducto open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default Cabecera;

