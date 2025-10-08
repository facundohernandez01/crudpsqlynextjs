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

interface Photo {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface PhotoListProps {
  searchQuery: string;
  apiRoute?: string; // Nueva prop opcional
}

export const PhotoList: React.FC<PhotoListProps> = ({ searchQuery, apiRoute = "/api/productos" }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // eliminar
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // editar
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", price: "", description: "" });

  // snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    fetch(apiRoute)
      .then((response) => response.json())
      .then((data: Photo[]) => {
        setPhotos(data.slice(0, 20));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
        setLoading(false);
      });
  }, [apiRoute]); // Dependencia actualizada

  // 🔹 eliminar
  const handleDeleteClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPhoto) return;
    try {
      await fetch(`/api/productos?id=${selectedPhoto.id}`, {
        method: "DELETE",
      });
      setPhotos((prev) => prev.filter((p) => p.id !== selectedPhoto.id));
      setSnackbar({ open: true, message: "Producto eliminado correctamente", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar producto", severity: "error" });
    }
    setOpenDeleteDialog(false);
    setSelectedPhoto(null);
  };

  // 🔹 editar
  const handleEditClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setEditForm({
      title: photo.title,
      price: String(photo.price),
      description: photo.description,
    });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPhoto) return;
    try {
      const res = await fetch("/api/productos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPhoto.id,
          title: editForm.title,
          price: editForm.price,
          description: editForm.description,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      const updated = await res.json();

      setPhotos((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );

      setSnackbar({ open: true, message: "Producto editado correctamente", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al editar producto", severity: "error" });
    }
    setOpenEditDialog(false);
    setSelectedPhoto(null);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedPhoto(null);
  };

  const filteredPhotos = photos.filter(
    (photo) =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase())
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
      {filteredPhotos.map((photo) => (
        <Grid item key={photo.id}>
          <Tarjeta
            titulo={photo.title}
            descripcion={photo.description}
            onAccion={() => handleEditClick(photo)}
            accionTexto="Editar"
            onEliminar={() => handleDeleteClick(photo)}
          />
        </Grid>
      ))}
    </Grid>


      {/* diálogo eliminar */}
      <ConfirmDialog
        open={openDeleteDialog}
        title="Confirmar eliminación"
        message={`¿Seguro que quieres eliminar "${selectedPhoto?.title}"?`}
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
