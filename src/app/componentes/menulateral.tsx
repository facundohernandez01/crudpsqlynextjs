"use client";

import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface DrawerComponentProps {
  isOpen: boolean;
  onClose: () => void;
  view: "productos" | "usuarios";
  setView: React.Dispatch<React.SetStateAction<"productos" | "usuarios">>;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ isOpen, onClose, view, setView }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = 240;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"} // temporal en móvil, fijo en desktop
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: isMobile ? 0 : "64px", // separa del AppBar en desktop
          height: isMobile ? "100%" : "calc(100% - 64px)",
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={view === "productos"}
            onClick={() => {
              setView("productos");
              onClose(); // cierra el drawer después de elegir
            }}
          >
            <ListItemText primary="Productos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={view === "usuarios"}
            onClick={() => {
              setView("usuarios");
              onClose();
            }}
          >
            <ListItemText primary="Usuarios" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default DrawerComponent;
