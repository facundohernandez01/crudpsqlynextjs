import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMsal } from "@azure/msal-react";

interface Capacitacion {
  id: number;
  usuario: string;
  plataforma: string;
  especialidad: string;
  curso: string;
  fecha: string;
}

const columns: GridColDef[] = [
  { field: "usuario", headerName: "Usuario", width: 200 },
  { field: "plataforma", headerName: "Plataforma", width: 200 },
  { field: "especialidad", headerName: "Especialidad", width: 200 },
  { field: "curso", headerName: "Curso", width: 200 },
  { field: "fecha", headerName: "Fecha", width: 150 },
];

const CapacitacionesList: React.FC = () => {
  const { accounts } = useMsal();
  const usuario = accounts[0]?.username;
  const idToken = accounts[0]?.idToken; // ID token de MSAL

  const [rows, setRows] = useState<Capacitacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapacitaciones = async () => {
      if (!usuario || !idToken) return;

      setLoading(true);
      try {
        const res = await fetch("/api/capacitaciones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`, // mandamos token de MSAL
          },
          body: JSON.stringify({ usuario }),
        });

        const data = await res.json();
        setRows(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCapacitaciones();
  }, [usuario, idToken]);

  if (!usuario) return <div>No hay usuario logueado</div>;
useEffect(() => {
  console.log(rows);
}, [rows]);
  return (
    <Box sx={{ height: 400, width: "100%", mt: 2 }}>
      <DataGrid
        getRowId={(row) => row.id}
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={loading}
        disableSelectionOnClick
        autoHeight

      />
    </Box>
  );
};

export default CapacitacionesList;
