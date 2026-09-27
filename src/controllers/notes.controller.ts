import * as noteService from '../services/notes.service.js'
import type { Request, Response } from 'express';

export async function getAll(req: Request, res: Response): Promise<void> {
  const notes = await noteService.getAllNotes()
  res.json(notes)
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({error: 'Неправильный id'})
    return
  }
  
  const note = await noteService.getNoteById(id)

  if(!note){
    res.status(404).json({error: 'Заметка не найдена'})
    return
  }

  res.json(note)
}

export async function create(req: Request, res: Response): Promise<void> {
  const {title, content, tags = []} = req.body ?? {}
  
  if(typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({error: 'Пустой или неправильный заголовок'})
    return
  }
  
  if(typeof content !== 'string' || content.trim() === '') {
    res.status(400).json({error: 'Пустой или неправильный контент'})
    return
  }
  
  if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
    res.status(400).json({error: 'Неверные тэги'})
    return
  }
  
  const created = await noteService.createNote(title, content, tags)
  res.status(201).json(created)
}