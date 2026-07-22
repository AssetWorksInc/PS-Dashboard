import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const meetingNotes = await pool.query(`
      SELECT id, title, body, meeting_date, attendees, action_items, author
      FROM meeting_notes
      ORDER BY meeting_date DESC
    `)

    const documents = await pool.query(`
      SELECT id, title, description, file_type, category, uploaded_by, created_at
      FROM shared_documents
      ORDER BY created_at DESC
    `)

    const team = await pool.query(`
      SELECT id, name, role, department, email, phone, is_ps_team
      FROM team_directory
      ORDER BY is_ps_team DESC, name ASC
    `)

    const discussions = await pool.query(`
      SELECT id, title, body, category, author, is_pinned, reply_count, created_at
      FROM discussions
      ORDER BY is_pinned DESC, created_at DESC
    `)

    const announcements = await pool.query(`
      SELECT id, title, body, author, is_pinned, created_at
      FROM project_announcements
      ORDER BY is_pinned DESC, created_at DESC
    `)

    return NextResponse.json({
      meetingNotes: meetingNotes.rows,
      documents: documents.rows,
      team: team.rows,
      discussions: discussions.rows,
      announcements: announcements.rows
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
