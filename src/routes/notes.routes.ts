import { Router } from 'express'
import * as noteController from '../controllers/notes.controller.js'

const notesRouter = Router()

notesRouter.get('/', noteController.getAll)
notesRouter.get('/:id', noteController.getById)
notesRouter.post('/', noteController.create)

export default notesRouter