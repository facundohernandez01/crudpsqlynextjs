import { Pool } from "pg";

let pool;

if (!global.pgPool) {
  global.pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

pool = global.pgPool;

export default pool;
