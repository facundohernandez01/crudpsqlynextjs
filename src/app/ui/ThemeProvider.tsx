"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import React, { ReactNode } from "react";
import { keyframes } from "@mui/system";

const bounceIn = keyframes`
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  80% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

interface ThemeProviderProps {
  children: ReactNode;
  darkMode: boolean; // ahora lo recibimos desde afuera
}

const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children, darkMode }) => {
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  components: {
        MuiModal: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease-in-out", // transición de entrada/salida
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0,0,0,0.5)",
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", // efecto tipo rebote
           animation: `${bounceIn} 0.3s ease`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // para todos los botones
        },
      },
      variants: [
        {
          props: { variant: "gradient" },
          style: {
            background: "linear-gradient(90deg, #350076ff 0%, #df006cff 70%, #df6100ff 100%)",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              opacity: 0.9,
            },
          },
        },
      ],
    },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "linear-gradient(90deg, #350076ff 0%, #df006cff 70%, #df6100ff 100%)",
          },
        },
      },
          MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#888", // borde por defecto
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#df006cff", // borde al hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#df006cff", // borde en focus
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#df006cff", // color label en focus
          },
        },
      },
    },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
