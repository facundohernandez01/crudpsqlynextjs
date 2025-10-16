"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Toolbar, useMediaQuery, useTheme, Box, Container } from "@mui/material";
import Cabecera from "./componentes/cabecera";
import DrawerComponent from "./componentes/menulateral";
import { ProductosList } from "./lib/fetchAPI";
import UserList from "./componentes/UserList";
import ModalProducto from "./componentes/ModalProducto";
import { useSearch, SearchProvider } from "./componentes/SearchContext";
import CustomThemeProvider from "./ui/ThemeProvider";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";
import AuthButton from "./componentes/AuthButton";
import useMicrosoftUser from "./hooks/useMicrosoftUser";

const CapacitacionesList = React.lazy(() => import("./componentes/CapacitacionesList"));

const msalInstance = new PublicClientApplication(msalConfig);

interface MainContentProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function MainContent({ darkMode, toggleDarkMode }: MainContentProps) {
  const { searchQuery } = useSearch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const userName = isAuthenticated ? accounts[0]?.name : "";
  const user = useMicrosoftUser();

  // Estado de vistas único
  const [view, setView] = useState<"productos" | "usuarios" | "capacitaciones">("productos");

  // Drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleToggleDrawer = () => setOpenDrawer(prev => !prev);

  // Modal Nuevo Producto
  const [openModal, setOpenModal] = useState(false);
  const [refreshProductos, setRefreshProductos] = useState(0);
  const handleProductoAgregado = () => setRefreshProductos(prev => prev + 1);

  return (
    <>
      <Cabecera
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onToggleDrawer={handleToggleDrawer}
        userName={userName}
        authButton={
          <AuthButton onShowCapacitaciones={() => setView("capacitaciones")} />
        }
        onNuevoProducto={() => setOpenModal(true)}
      />
      <Toolbar />
      <DrawerComponent
        isOpen={openDrawer}
        onClose={handleToggleDrawer}
        view={view}
        setView={setView}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="lg">
          {view === "capacitaciones" ? (
            <Suspense fallback={<div>Cargando capacitaciones...</div>}>
              <CapacitacionesList />
            </Suspense>
          ) : view === "productos" ? (
            <ProductosList searchQuery={searchQuery} refresh={refreshProductos} />
          ) : (
            <UserList user={user} searchQuery={searchQuery} />
          )}
        </Container>
      </Box>

      {/* Modal Nuevo Producto */}
      <ModalProducto
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleProductoAgregado}
      />
    </>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    msalInstance.initialize().then(() => setIsInitialized(true));
  }, []);

  if (!isInitialized) return null;

  return (
    <MsalProvider instance={msalInstance}>
      <CustomThemeProvider darkMode={darkMode}>
        <SearchProvider>
          <MainContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </SearchProvider>
      </CustomThemeProvider>
    </MsalProvider>
  );
}
