"use client";
import Demo from "./componentes/componenteDemo";
import Cabecera from "./componentes/cabecera";
import { PhotoList } from "./lib/fetchAPI";
import Container from "@mui/material/Container";
import { useSearch } from "./componentes/SearchContext";
import { SearchProvider } from "./componentes/SearchContext";
import CustomThemeProvider from "./ui/ThemeProvider";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import UserList from "./componentes/UserList";
import { Toolbar, useMediaQuery, useTheme, Box } from "@mui/material";

interface MainContentProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function MainContent({ darkMode, toggleDarkMode }: MainContentProps) {
  const { searchQuery } = useSearch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<"productos" | "usuarios">("productos");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 👈 detecta si es móvil

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawerWidth = 240;

  return (
    <>
      {/* CABECERA */}
      <Cabecera
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onToggleDrawer={handleDrawerToggle}
      />

      {/* Espaciador para que el contenido no quede debajo del AppBar */}
      <Toolbar />

      {/* DRAWER */}
      <Drawer
        
        variant={isMobile ? "temporary" : "persistent"} // 👈 temporal en móvil, fijo en desktop
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        disableScrollLock={true}
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
                setDrawerOpen(false);
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
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Usuarios" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          ml: { sm: drawerOpen && !isMobile ? `${drawerWidth}px` : 0 }, // si el drawer está abierto en desktop, empuja el contenido
          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="lg">
          <Demo />
          {view === "productos" ? (
            <PhotoList searchQuery={searchQuery} />
          ) : (
            <UserList searchQuery={searchQuery} />
          )}
        </Container>
      </Box>
    </>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <CustomThemeProvider darkMode={darkMode}>
      <SearchProvider>
        <MainContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </SearchProvider>
    </CustomThemeProvider>
  );
}
