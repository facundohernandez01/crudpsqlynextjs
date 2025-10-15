// componentes/AuthButton.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AccountInfo, AuthenticationResult } from "@azure/msal-browser";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import SchoolIcon from "@mui/icons-material/School";

export default function AuthButton({ onShowCapacitaciones }: { onShowCapacitaciones: () => void }): JSX.Element {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPhoto = async () => {
      if (!isAuthenticated || !accounts || accounts.length === 0) {
        setPhotoUrl(null);
        return;
      }
      const account = accounts[0] as AccountInfo;
      const tokenRequest = {
        scopes: ["User.Read"],
        account,
      };

      let result: AuthenticationResult;
      try {
        result = await instance.acquireTokenSilent(tokenRequest);
      } catch (silentError) {
        try {
          result = await instance.acquireTokenPopup(tokenRequest);
        } catch (popupError) {
          console.error("Error acquiring token for Graph:", popupError);
          return;
        }
      }

      // Si no hay result, salir
      if (!result || !result.accessToken) {
        return;
      }

      try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
          headers: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        });

        if (!response.ok) {
          // Si no tiene foto (404) o error, no rompas
          if (response.status !== 404) {
            console.warn("Graph photo fetch failed:", response.status);
          }
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (!isMounted) {
          URL.revokeObjectURL(url);
          return;
        }

        // revocar URL anterior si existía
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
        }
        objectUrlRef.current = url;
        setPhotoUrl(url);
      } catch (err) {
        console.error("Error fetching photo:", err);
      }
    };

    loadPhoto();
    return () => {
      isMounted = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [isAuthenticated, accounts, instance]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleLogin = async () => {
    try {
      await instance.loginPopup({ scopes: ["User.Read"] });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutPopup({ account: accounts[0] as AccountInfo });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      handleClose();
    }
  };

  if (!isAuthenticated) {
    return (
      <Button color="inherit" onClick={handleLogin}>
        Iniciar sesión
      </Button>
    );
  }

  const user = accounts[0] as AccountInfo | undefined;
  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("") ?? "?";

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit" size="small">
        <Avatar src={photoUrl ?? undefined} alt={user?.name} sx={{ width: 32, height: 32 }}>
          {!photoUrl && initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => { onShowCapacitaciones(); handleClose(); }}>
          <ListItemIcon>
            <SchoolIcon fontSize="small" />
          </ListItemIcon>
          Mis capacitaciones
        </MenuItem>
        <MenuItem disabled>{user?.name}</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>
    </>
  );
}
