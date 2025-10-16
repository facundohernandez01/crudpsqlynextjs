"use client";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export default function useMicrosoftGraphUsers() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const searchUsers = async (query: string) => {
    if (!isAuthenticated || accounts.length === 0 || !query) return [];

    const account = accounts[0];
    let token: string;

    try {
      const result = await instance.acquireTokenSilent({
        scopes: ["User.ReadBasic.All"],
        account,
      });
      token = result.accessToken;
    } catch (err: any) {
      if (err instanceof InteractionRequiredAuthError) {
        const result = await instance.acquireTokenPopup({
          scopes: ["User.ReadBasic.All"],
          account,
        });
        token = result.accessToken;
      } else {
        console.error("Error obteniendo token Graph:", err);
        return [];
      }
    }

    try {
      const response = await fetch(
    `https://graph.microsoft.com/v1.0/users?$search="displayName:${query}"&$select=id,displayName,mail,jobTitle,userPrincipalName`,        

        {
          headers: {
            Authorization: `Bearer ${token}`,
            ConsistencyLevel: "eventual",
          },
        }
      );

      if (!response.ok) {
        console.error("Error buscando usuarios en Graph:", await response.text());
        return [];
      }

      const data = await response.json();
      return data.value;
    } catch (err) {
      console.error("Error buscando usuarios en Graph:", err);
      return [];
    }
  };

  return { searchUsers };
}
