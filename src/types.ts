export interface Tag {
  id: number,
  name: string
}

export interface Note {
  id: number,
  title: string,
  content: string,
  created_at: Date,
  tags: Tag[]
}

export type NoteWithoutTags = Omit<Note, 'tags'>