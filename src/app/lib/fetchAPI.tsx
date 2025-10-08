"use client";

import React, { useEffect, useState } from "react";
import Tarjeta from "../componentes/tarjeta";
import ConfirmDialog from "../componentes/ConfirmDialog";
import {
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface Producto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface ProductosListProps {
  searchQuery: string;
  apiRoute?: string; // Nueva prop opcional
}

export const ProductosList: React.FC<ProductosListProps> = ({ searchQuery, apiRoute = "/api/productos" }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // eliminar
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  // editar
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", price: "", description: "" });

  // snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    fetch(apiRoute)
      .then((response) => response.json())
      .then((data: Producto[]) => {
        setProductos(data.slice(0, 20));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching productos:", error);
        setLoading(false);
      });
  }, [apiRoute]); // Dependencia actualizada

  // 🔹 eliminar
  const handleDeleteClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProducto) return;
    try {
      await fetch(`/api/productos?id=${selectedProducto.id}`, {
        method: "DELETE",
      });
      setProductos((prev) => prev.filter((p) => p.id !== selectedProducto.id));
      setSnackbar({ open: true, message: "Producto eliminado correctamente", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar producto", severity: "error" });
    }
    setOpenDeleteDialog(false);
    setSelectedProducto(null);
  };

  // 🔹 editar
  const handleEditClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setEditForm({
      title: producto.title,
      price: String(producto.price),
      description: producto.description,
    });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProducto) return;
    try {
      const res = await fetch("/api/productos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedProducto.id,
          title: editForm.title,
          price: editForm.price,
          description: editForm.description,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      const updated = await res.json();

      setProductos((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );

      setSnackbar({ open: true, message: "Producto editado correctamente", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al editar producto", severity: "error" });
    }
    setOpenEditDialog(false);
    setSelectedProducto(null);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedProducto(null);
  };

  const filteredProductos = productos.filter(
    (producto) =>
      producto.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producto.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Cargando fotos...</p>;

  return (
    <>
    <Grid
      container
      spacing={2}
      paddingTop={10}
      justifyContent="center" // 👈 centra los items
    >
      {filteredProductos.map((producto) => (
        <Grid item key={producto.id}>
          <Tarjeta
            titulo={producto.title}
            descripcion={producto.description}
            onAccion={() => handleEditClick(producto)}
            accionTexto="Editar"
            onEliminar={() => handleDeleteClick(producto)}
          />
        </Grid>
      ))}
    </Grid>


      {/* diálogo eliminar */}
      <ConfirmDialog
        open={openDeleteDialog}
        title="Confirmar eliminación"
        message={`¿Seguro que quieres eliminar "${selectedProducto?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        
      />

      {/* diálogo editar */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false) } disableScrollLock>
        <DialogTitle>Editar producto</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Precio"
            type="number"
            fullWidth
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button variant="gradient" onClick={handleSaveEdit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
