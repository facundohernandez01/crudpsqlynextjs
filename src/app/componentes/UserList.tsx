import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface UserListProps {
  searchQuery: string;
}

const UserList: React.FC<UserListProps> = ({ searchQuery }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {filteredUsers.map(user => (
        <Card key={user.id} sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h6">{user.name}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            {/* ...otros campos... */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserList;
