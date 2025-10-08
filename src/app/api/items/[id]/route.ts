import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crud_db',
  password: '123123',
  port: 5432,
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, description } = await req.json();
  try {
    const result = await pool.query(
      'UPDATE items SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, params.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.query('DELETE FROM items WHERE id = $1', [params.id]);
    return NextResponse.json({}, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
