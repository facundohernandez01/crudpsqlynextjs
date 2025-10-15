import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMsal } from "@azure/msal-react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import ConfirmDialog from "./ConfirmDialog"; // tu componente

interface Capacitacion {
  id: number;
  usuario: string;
  plataforma: string;
  especialidad: string;
  curso: string;
  fecha: string;
}



const CapacitacionesList: React.FC = () => {
  const { instance, accounts } = useMsal();
  const usuario = accounts[0]?.username;

  const [rows, setRows] = useState<Capacitacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal estados
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<Capacitacion | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Capacitacion | null>(null);

  // Formulario
  const [form, setForm] = useState({
    plataforma: "",
    especialidad: "",
    curso: "",
    fecha: "",
  });

  // Refresca la tabla
  const fetchCapacitaciones = async () => {
    if (!usuario) return;
    try {
      setLoading(true);
      const response = await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: accounts[0],
      });
      const token = response.idToken;
      const res = await fetch("/api/capacitaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Agrega handlers para acciones
      setRows(
        data.map((row: Capacitacion) => ({
          ...row,
          onEdit: handleEditOpen,
          onDelete: handleDelete,
        }))
      );
    } catch (err) {
      console.error("Error al obtener capacitaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacitaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  // Eliminar
  const handleDelete = async (row: Capacitacion) => {
    if (!window.confirm(`¿Eliminar capacitación "${row.curso}"?`)) return;
    try {
      await fetch(`/api/capacitaciones?id=${row.id}`, { method: "DELETE" });
      fetchCapacitaciones();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  // Editar
  const handleEditOpen = (row: Capacitacion) => {
    setEditData(row);
    setForm({
      plataforma: row.plataforma,
      especialidad: row.especialidad,
      curso: row.curso,
      fecha: row.fecha,
    });
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!editData) return;
    try {
      await fetch("/api/capacitaciones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editData.id,
          usuario: editData.usuario,
          ...form,
        }),
      });
      setOpenEdit(false);
      setEditData(null);
      fetchCapacitaciones();
    } catch (err) {
      alert("Error al editar");
    }
  };

  // Agregar
  const handleAddOpen = () => {
    setForm({
      plataforma: "",
      especialidad: "",
      curso: "",
      fecha: "",
    });
    setOpenAdd(true);
  };

const handleAddSave = async () => {
  try {
    const token = (await instance.acquireTokenSilent({
      scopes: ["User.Read"],
      account: accounts[0],
    })).idToken;

    await fetch("/api/capacitaciones", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
      }),
    });
    setOpenAdd(false);
    fetchCapacitaciones();
  } catch (err) {
    alert("Error al agregar");
  }
};

const handleConfirmDelete = async () => {
    if (!rowToDelete) return;

    try {
      const token = (await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: accounts[0],
      })).idToken;

      await fetch("/api/capacitaciones", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: rowToDelete.id }),
      });

      setConfirmOpen(false);
      setRowToDelete(null);
      fetchCapacitaciones();
    } catch (err) {
      alert("Error al eliminar");
    }
  };
  if (!usuario) return <div>No hay usuario logueado</div>;
const columns: GridColDef[] = [
  { field: "usuario", headerName: "Usuario", width: 200 },
  { field: "plataforma", headerName: "Plataforma", width: 200 },
  { field: "especialidad", headerName: "Especialidad", width: 200 },
  { field: "curso", headerName: "Curso", width: 200 },
  { field: "fecha", headerName: "Fecha", width: 150 },
  {
    field: "acciones",
    headerName: "Acciones",
    width: 130,
    sortable: false,
    renderCell: (params) => (
      <>
        <IconButton
          color="primary"
          size="small"
          onClick={() => params.row.onEdit(params.row)}
        >
          <EditIcon />
        </IconButton>
    <IconButton
      color="error"
      size="small"
      onClick={() => {
        setRowToDelete(params.row); // guardamos la fila
        setConfirmOpen(true);       // abrimos el dialog
      }}
    >
      <DeleteIcon />
    </IconButton>
      </>
    ),
  },
];
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
    <Box sx={{ height: 400, width: "100%" }}>
    <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={5}
        loading={loading}
        disableSelectionOnClick
        
    />
    </Box>
        
    <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        message={`¿Eliminar capacitación "${rowToDelete?.curso}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="gradient" color="primary" onClick={handleAddOpen}>
          Agregar capacitación
        </Button>
      </Box>

      {/* Modal agregar */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Agregar capacitación</DialogTitle>
        <DialogContent>
          <TextField
            label="Plataforma"
            value={form.plataforma}
            onChange={(e) =>
              setForm({ ...form, plataforma: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Especialidad"
            value={form.especialidad}
            onChange={(e) =>
              setForm({ ...form, especialidad: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Curso"
            value={form.curso}
            onChange={(e) => setForm({ ...form, curso: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancelar</Button>
          <Button
            onClick={handleAddSave}
            variant="gradient"
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal editar */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar capacitación</DialogTitle>
        <DialogContent>
          <TextField
            label="Plataforma"
            value={form.plataforma}
            onChange={(e) =>
              setForm({ ...form, plataforma: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Especialidad"
            value={form.especialidad}
            onChange={(e) =>
              setForm({ ...form, especialidad: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Curso"
            value={form.curso}
            onChange={(e) => setForm({ ...form, curso: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CapacitacionesList;
