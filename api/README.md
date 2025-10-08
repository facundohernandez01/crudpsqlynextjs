# API Backend para CRUD con PostgreSQL

## Instalación

```bash
cd api
npm install express pg cors
```

## Ejecución

```bash
node index.js
```

## Notas

- Asegúrate de tener la base de datos `crud_db` y la tabla `items` creada:

```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT
);
```

- Cambia la contraseña en la configuración de `Pool` si tu usuario `postgres` la tiene.
