import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import pool from "../../lib/db";

// Configuración de cliente y función getKey...

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

// Función para verificar el token
async function verifyToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          algorithms: ["RS256"],
          audience: process.env.AZURE_CLIENT_ID,
          issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`,
        },
        (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        }
      );
    });

    const usuario =
      decoded.preferred_username || decoded.upn || decoded.email || "";

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado en token" }, { status: 400 });
    }

    return usuario;
  } catch (err: any) {
    console.error("🔥 Error en la verificación del token:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET
export async function GET(req: NextRequest) {
  try {
    const usuario = await verifyToken(req);
    if (usuario instanceof NextResponse) return usuario;

    const result = await pool.query(
      "SELECT * FROM capacitaciones WHERE usuario = $1",
      [usuario]
    );

    const data = result.rows.map((row: any, index: number) => ({
      id: index + 1,
      ...row,
    }));

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("🔥 Error en /api/capacitaciones:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const usuario = await verifyToken(req);
    if (usuario instanceof NextResponse) return usuario;

    // Obtenemos los campos que vienen del frontend
    const { curso, plataforma, especialidad, fecha } = await req.json();

    // Insertar en la base de datos
    const result = await pool.query(
      "INSERT INTO capacitaciones (usuario, curso, plataforma, especialidad, fecha) VALUES ($1, $2, $3, $4, $5)",
      [usuario, curso, plataforma, especialidad, fecha]
    );

    return NextResponse.json({ message: "Capacitación creada con éxito" });
  } catch (err: any) {
    console.error("🔥 Error en /api/capacitaciones:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest) {
  try {
    const usuario = await verifyToken(req);
    if (usuario instanceof NextResponse) return usuario;

    const { id, /*campos que esperas recibir*/ } = await req.json();

    // Actualizar en la base de datos
    const result = await pool.query(
      "UPDATE capacitaciones SET /*campos*/ = /*valores*/ WHERE id = $1 AND usuario = $2",
      [id, usuario]
    );

    return NextResponse.json({ message: "Capacitación actualizada con éxito" });
  } catch (err: any) {
    console.error("🔥 Error en /api/capacitaciones:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const usuario = await verifyToken(req);
    if (usuario instanceof NextResponse) return usuario;

    const { id } = await req.json();

    // Eliminar de la base de datos
    const result = await pool.query(
      "DELETE FROM capacitaciones WHERE id = $1 AND usuario = $2",
      [id, usuario]
    );

    return NextResponse.json({ message: "Capacitación eliminada con éxito" });
  } catch (err: any) {
    console.error("🔥 Error en /api/capacitaciones:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}