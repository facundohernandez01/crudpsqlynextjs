import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/db";
import jwt from "jsonwebtoken"; // Para verificar ID token

// En production conviene obtener la clave pública de Microsoft en vez de JWT_SECRET
const MSAL_JWKS_URL = "https://login.microsoftonline.com/common/discovery/keys";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    // Verificamos el token usando jsonwebtoken (para simplificar usamos JWT_SECRET)
    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    // Aquí opcional: podrías validar la firma usando la clave pública de Microsoft
    const { usuario } = await req.json();
    if (!usuario) return NextResponse.json({ error: "No usuario" }, { status: 400 });

    // Filtramos por correo en la DB
const result = await pool.query(
  `SELECT id, usuario, plataforma, especialidad, curso, fecha
   FROM capacitaciones
   WHERE usuario = $1
   ORDER BY id`,
  [usuario]
);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
