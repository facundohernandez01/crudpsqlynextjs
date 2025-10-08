"use client";
import Demo from "./componentes/componenteDemo";
import Cabecera from "./componentes/cabecera";
import { ProductosList } from "./lib/fetchAPI";
import Container from "@mui/material/Container";
import { useSearch } from "./componentes/SearchContext";
import { SearchProvider } from "./componentes/SearchContext";
import CustomThemeProvider from "./ui/ThemeProvider";
import { useState } from "react";
import UserList from "./componentes/UserList";
import { Toolbar, useMediaQuery, useTheme, Box } from "@mui/material";
import DrawerComponent from "./componentes/menulateral";

interface MainContentProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function MainContent({ darkMode, toggleDarkMode }: MainContentProps) {
  const { searchQuery } = useSearch();
  const [view, setView] = useState<"productos" | "usuarios">("productos");
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 👈 detecta si es móvil


  const handleToggleDrawer = () => setOpenDrawer((prev) => !prev);

  return (
    <>
      {/* CABECERA */}
      <Cabecera darkMode={darkMode}  toggleDarkMode={toggleDarkMode}  onToggleDrawer={handleToggleDrawer}  />
      <Toolbar />
      <DrawerComponent isOpen={openDrawer} onClose={handleToggleDrawer} view={view} setView={setView}/>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          // ml: { sm: drawerOpen && !isMobile ? `${drawerWidth}px` : 0 }, // si el drawer está abierto en desktop, empuja el contenido
          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="lg">
          <Demo />
          {view === "productos" ? (
            <ProductosList searchQuery={searchQuery} />
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
