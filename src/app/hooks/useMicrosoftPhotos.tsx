"use client";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useRef, useCallback } from "react";
import { AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";

export default function useMicrosoftPhotos() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const cacheRef = useRef<Map<string, string>>(new Map());

  const getUserPhoto = useCallback(
    async (email: string): Promise<string | null> => {
      if (!isAuthenticated || accounts.length === 0 || !email) return null;

      // Retorna de cache si ya existe
      if (cacheRef.current.has(email)) return cacheRef.current.get(email)!;

      const account = accounts[0] as AccountInfo;

      const acquireToken = async () => {
        try {
          return await instance.acquireTokenSilent({
            scopes: ["User.ReadBasic.All"],
            account,
          });
        } catch (error: any) {
          // Si no hay consentimiento o se necesita interacción, abrimos popup
          if (error instanceof InteractionRequiredAuthError) {
            return await instance.acquireTokenPopup({
              scopes: ["User.ReadBasic.All"],
              account,
            });
          } else {
            throw error;
          }
        }
      };

      try {
        const result = await acquireToken();
        const token = result.accessToken;

        // 🔍 Buscar usuario Graph por email o userPrincipalName
        const searchUrl = `https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}' or userPrincipalName eq '${email}'&$select=id`;
        const userResp = await fetch(searchUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResp.json();
        const userId = userData?.value?.[0]?.id;

        if (!userId) return null;

        // 📸 Obtener foto del usuario
        const photoResp = await fetch(
          `https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!photoResp.ok) return null;

        const blob = await photoResp.blob();
        const url = URL.createObjectURL(blob);

        cacheRef.current.set(email, url);
        return url;
      } catch (err) {
        console.error(`Error al obtener foto para ${email}:`, err);
        return null;
      }
    },
    [instance, accounts, isAuthenticated]
  );

  return { getUserPhoto };
}
