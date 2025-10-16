import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import useMicrosoftPhotos from "../hooks/useMicrosoftPhotos";
import useMicrosoftGraphUsers from "../hooks/useMicrosoftGraphUsers";

interface LocalUser {
  id: number;
  name: string;
  email: string;
  rol: number;
}

interface GraphUser {
  id: string;
  displayName: string;
  mail: string;
  jobTitle: string | null;
  userPrincipalName: string;
}

interface UserListProps {
  searchQuery: string;
}

const UserList: React.FC<UserListProps> = ({ searchQuery }) => {
  const [localUsers, setLocalUsers] = useState<LocalUser[]>([]);
  const [graphUsers, setGraphUsers] = useState<GraphUser[]>([]);
  const [photoCache, setPhotoCache] = useState<Record<string, string | null>>({});

  const { getUserPhoto } = useMicrosoftPhotos();
  const { searchUsers } = useMicrosoftGraphUsers();

  // Cargar usuarios locales
  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data) => setLocalUsers(data))
      .catch((err) => console.error("Error cargando usuarios locales:", err));
  }, []);

  // Buscar usuarios en Graph
  useEffect(() => {
    const fetchGraphUsers = async () => {
      if (!searchQuery) {
        setGraphUsers([]);
        return;
      }
      const results = await searchUsers(searchQuery);
      setGraphUsers(results);
    };
    fetchGraphUsers();
  }, [searchQuery]);

  // Obtener fotos de todos los usuarios (local + Graph)
  useEffect(() => {
    const fetchPhotos = async () => {
      const emails = [
        ...localUsers.map((u) => u.email),
        ...graphUsers.map((u) => u.mail),
      ];

      const newPhotos: Record<string, string | null> = {};
      await Promise.all(
        emails.map(async (email) => {
          if (!photoCache[email]) {
            const url = await getUserPhoto(email);
            newPhotos[email] = url;
          }
        })
      );

      if (Object.keys(newPhotos).length > 0) {
        setPhotoCache((prev) => ({ ...prev, ...newPhotos }));
      }
    };

    fetchPhotos();
  }, [localUsers, graphUsers]);

  // Combinar usuarios locales + Graph
  const combinedUsers = [
    ...localUsers.map((u) => ({
      id: u.id.toString(),
      name: u.name,
      email: u.email,
      source: "local",
    })),
    ...graphUsers.map((u) => ({
      id: u.id,
      name: u.displayName,
      email: u.mail,
      source: "graph",
    })),
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {combinedUsers.map((user) => {
        const photoUrl = photoCache[user.email];
        return (
          <Card key={user.id} sx={{ width: 280 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={photoUrl || undefined}
                  alt={user.name}
                  sx={{ width: 48, height: 48 }}
                >
                  {!photoUrl && user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography color="text.secondary">{user.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.source === "local" ? "Local DB" : "Microsoft Graph"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserList;
