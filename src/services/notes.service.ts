import { pool } from '../db/pool.js'
import * as notesModel from '../models/notes.model.js'
import * as tagsModel from '../models/tags.model.js'
import type { Note } from '../types.js'

export async function getAllNotes(): Promise<Note[]>{
  return notesModel.getAllNotes()
}

export async function getNoteById(id: number): Promise<Note | undefined>{
  return notesModel.getNoteById(id)
}

export async function createNote(title: string, content: string, tags: string[]): Promise<Note | undefined> {
  const setOfTags = new Set<string>()

  tags.forEach(tag => {
    const formated = tag.trim().toLowerCase()
    if(formated !== ''){
      setOfTags.add(formated)
    }
  })

  const client = await pool.connect()
  let noteId: number

  try{
    await client.query('BEGIN')
    
    const note = await notesModel.createNote(client, title, content)
    noteId = note.id
    
    for(const tag of setOfTags){
      const createdTag = await tagsModel.findOrCreateTag(client, tag)
      await notesModel.addTagToNote(client, note.id, createdTag.id)
    }

    await client.query('COMMIT')
  } catch(err) {
    await client.query('ROLLBACK')
    throw err
  } finally{
    client.release()
  }

  return notesModel.getNoteById(noteId)
}