"use client";

import { useEffect, useState, useRef } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AccountInfo, AuthenticationResult } from "@azure/msal-browser";

interface MicrosoftUser {
  name: string | null;
  email: string | null;
  jobTitle: string | null;
  photoUrl: string | null;
  id: string | null;
}

export default function useMicrosoftUser() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState<MicrosoftUser | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      if (!isAuthenticated || accounts.length === 0) {
        setUser(null);
        return;
      }

      const account = accounts[0] as AccountInfo;
      const tokenRequest = {
        scopes: ["User.Read"],
        account,
      };

      try {
        let result: AuthenticationResult;
        try {
          result = await instance.acquireTokenSilent(tokenRequest);
        } catch {
          result = await instance.acquireTokenPopup(tokenRequest);
        }

        if (!result?.accessToken) return;

        // Obtener datos básicos del usuario
        const userResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: { Authorization: `Bearer ${result.accessToken}` },
        });
        const userData = await userResponse.json();

        // Intentar cargar la foto
        let photoUrl: string | null = null;
        try {
          const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: { Authorization: `Bearer ${result.accessToken}` },
          });
          if (photoResponse.ok) {
            const blob = await photoResponse.blob();
            const url = URL.createObjectURL(blob);
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = url;
            photoUrl = url;
          }
        } catch {
          // puede no tener foto
        }

        if (isMounted) {
          setUser({
            name: userData.displayName ?? null,
            email: userData.mail ?? userData.userPrincipalName ?? null,
            jobTitle: userData.jobTitle ?? null,
            id: userData.id ?? null,
            photoUrl,
          });
        }
      } catch (err) {
        console.error("Error fetching Microsoft user:", err);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [isAuthenticated, accounts, instance]);

  return user;
}
