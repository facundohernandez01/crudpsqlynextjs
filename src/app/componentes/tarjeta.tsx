import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface TarjetaProps {
  titulo: string;
  descripcion: string;
  onAccion?: () => void;
  accionTexto?: string;
  onEliminar?: () => void; // 👈 nueva prop opcional
}

const Tarjeta: React.FC<TarjetaProps> = ({
  titulo,
  descripcion,
  onAccion,
  accionTexto = "Acción",
  onEliminar,
}) => (
  <Card sx={{ width: 900 }}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {descripcion}
      </Typography>
    </CardContent>

    <CardActions>
      {onAccion && (
        <Button variant="gradient" size="small" onClick={onAccion}>
          {accionTexto}
        </Button>
      )}
      {onEliminar && (
        <Button size="small" color="error" onClick={onEliminar}>
          Eliminar
        </Button>
      )}
    </CardActions>
  </Card>
);

export default Tarjeta;
