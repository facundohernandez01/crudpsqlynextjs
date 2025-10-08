import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crud_db',
  password: '123123',
  port: 5432,
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();
  try {
    const result = await pool.query(
      'INSERT INTO items (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
