import type { PoolClient } from 'pg'
import type { Note, NoteWithoutTags } from '../types.js'
import { pool } from '../db/pool.js'

export async function getAllNotes(): Promise<Note[]> {
  const result = await pool.query<Note>(`SELECT
    notes.id,
    notes.title,
    notes.content,
    notes.created_at,
    COALESCE(
      json_agg(
        json_build_object('id', tags.id, 'name', tags.name)
      ) FILTER (WHERE tags.id IS NOT NULL),
      '[]'
    ) AS tags
    FROM notes
    LEFT JOIN note_tags ON note_tags.note_id = notes.id
    LEFT JOIN tags ON tags.id = note_tags.tag_id
    GROUP BY notes.id
    ORDER BY notes.created_at DESC;
  `)
  return result.rows
}

export async function getNoteById(id: number): Promise<Note | undefined> {
  const result = await pool.query<Note>(`SELECT
    notes.id,
    notes.title,
    notes.content,
    notes.created_at,
    COALESCE(
      json_agg(
        json_build_object('id', tags.id, 'name', tags.name)
      ) FILTER (WHERE tags.id IS NOT NULL),
      '[]'
    ) AS tags
    FROM notes
    LEFT JOIN note_tags ON note_tags.note_id = notes.id
    LEFT JOIN tags ON tags.id = note_tags.tag_id
    WHERE notes.id = $1
    GROUP BY notes.id
    ORDER BY notes.created_at DESC;
  `, [id])
  return result.rows[0]
}

export async function createNote(client: PoolClient, title: string, content: string): Promise<NoteWithoutTags> {
  const result = await client.query<NoteWithoutTags>(`
    INSERT INTO notes (title, content)
    VALUES ($1, $2)
    RETURNING id, title, content, created_at;
  `, [title, content])

  return result.rows[0]
}

export async function addTagToNote(client: PoolClient, noteId: number, tagId: number): Promise<void> {
  await client.query(`
    INSERT INTO note_tags (note_id, tag_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `, [noteId, tagId])
}