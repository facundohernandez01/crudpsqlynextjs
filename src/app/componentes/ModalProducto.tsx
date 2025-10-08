"use client";

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";


const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface ModalProductoProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalProducto: React.FC<ModalProductoProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [title, setNombre] = useState("");
  const [price, setPrecio] = useState("");
  const [description, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          description,
        }),
      });

      setNombre("");
      setPrecio("");
      setDescripcion("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (

 <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nombre"
            value={title}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Precio"
            type="number"
            value={price}
            onChange={(e) => setPrecio(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Descripción"
            value={description}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            sx={{
              background:
                "linear-gradient(90deg, #350076ff 0%, #df006cff 70%, #df6100ff 100%)",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { opacity: 0.9 },
            }}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalProducto;
