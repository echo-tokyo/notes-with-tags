import 'dotenv/config';
import cors from 'cors'
import express from 'express'
import notesRouter from './routes/notes.routes.js'
import type { Request, Response, NextFunction } from 'express';

const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.send({response: 'ok'})
})

app.use('/notes', notesRouter)

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'что-то пошло не так' })
})

app.listen(port, () => {
  console.log('Сервер запущен.')
})