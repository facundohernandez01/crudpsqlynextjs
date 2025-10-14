"use client";
import Demo from "./componentes/componenteDemo";
import Cabecera from "./componentes/cabecera";
import { ProductosList } from "./lib/fetchAPI";
import Container from "@mui/material/Container";
import { useSearch } from "./componentes/SearchContext";
import { SearchProvider } from "./componentes/SearchContext";
import CustomThemeProvider from "./ui/ThemeProvider";
import { useState, useEffect } from "react";
import UserList from "./componentes/UserList";
import { Toolbar, useMediaQuery, useTheme, Box } from "@mui/material";
import DrawerComponent from "./componentes/menulateral";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication, type IPublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";
import AuthButton from "./componentes/AuthButton";
import ModalProducto from "./componentes/ModalProducto";

// ✅ instancia global, fuera del componente
const msalInstance = new PublicClientApplication(msalConfig);

interface MainContentProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function MainContent({ darkMode, toggleDarkMode }: MainContentProps) {
  const { searchQuery } = useSearch();
  const [view, setView] = useState<"productos" | "usuarios">("productos");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [refreshProductos, setRefreshProductos] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const userName = isAuthenticated ? accounts[0]?.name : "";

  const handleToggleDrawer = () => setOpenDrawer((prev) => !prev);

  // Nueva función para refrescar productos
  const handleProductoAgregado = () => {
    setRefreshProductos((prev) => prev + 1);
  };

  return (
    <>
      <Cabecera
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onToggleDrawer={handleToggleDrawer}
        userName={userName}
        authButton={<AuthButton />}
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
          <Demo />
          {view === "productos" ? (
            <ProductosList searchQuery={searchQuery} refresh={refreshProductos} />
          ) : (
            <UserList searchQuery={searchQuery} />
          )}
        </Container>
      </Box>
      {/* Modal para nuevo producto */}
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
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // ✅ aseguramos inicialización antes de renderizar el provider
    msalInstance.initialize().then(() => setIsInitialized(true));
  }, []);

  if (!isInitialized) {
    return null; // o un loader si querés
  }

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
