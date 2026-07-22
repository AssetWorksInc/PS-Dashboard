import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const sessions = await pool.query(`
      SELECT id, title, description, type, presenter, duration_min, tags, created_at
      FROM training_sessions
      WHERE is_published = true
      ORDER BY created_at DESC
    `)

    const materials = await pool.query(`
      SELECT id, title, description, type, category, author, created_at
      FROM training_materials
      ORDER BY created_at DESC
    `)

    return NextResponse.json({
      sessions: sessions.rows,
      materials: materials.rows
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
