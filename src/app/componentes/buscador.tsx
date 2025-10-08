"use client"
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useSearch } from "./SearchContext";

const Buscador: React.FC = () => {
    const [valor, setValor] = useState('');
    const { setSearchQuery } = useSearch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nuevoValor = event.target.value;
        setValor(nuevoValor);
        setSearchQuery(nuevoValor);
    };

    return (
<TextField
  label="Buscar tarjetas"
  variant="outlined"
  value={valor}
  onChange={handleChange}
  size="small"
    sx={{
      textColor: "black",
      borderRadius: 1,
      width: 350,
      marginLeft: 2,
      alignContent: "center",
      left: 0,
    }}
/>

    );
};

export default Buscador;