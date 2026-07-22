import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const categories = await pool.query(`
      SELECT id, name, description, icon, sort_order
      FROM kb_categories
      ORDER BY sort_order ASC
    `)

    const articles = await pool.query(`
      SELECT id, category_id, title, type, author, view_count, created_at
      FROM kb_articles
      WHERE is_published = true
      ORDER BY created_at DESC
    `)

    return NextResponse.json({
      categories: categories.rows,
      articles: articles.rows
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
