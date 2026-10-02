import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3001;
let nextId = 1;
let todos = [];

app.use(cors());
app.use(express.json());

app.get('/api/todos', (_req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title) return res.status(400).json({ message: 'Please enter a task.' });

  const todo = { id: String(nextId++), title, completed: false, createdAt: new Date().toISOString() };
  todos = [todo, ...todos];
  return res.status(201).json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((todo) => todo.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Task not found.' });

  const current = todos[index];
  const title = req.body?.title === undefined ? current.title : String(req.body.title).trim();
  if (!title) return res.status(400).json({ message: 'Task text cannot be empty.' });
  const completed = req.body?.completed === undefined ? current.completed : req.body.completed;
  if (typeof completed !== 'boolean') return res.status(400).json({ message: 'Completed must be true or false.' });

  todos[index] = { ...current, title, completed };
  return res.json(todos[index]);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((todo) => todo.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Task not found.' });
  todos = todos.filter((todo) => todo.id !== req.params.id);
  return res.status(204).end();
});

// In production, serve the built React app from the same Express server.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../dist');
app.use(express.static(clientDist));
app.get('*', (_req, res, next) => {
  if (_req.path.startsWith('/api/')) return next();
  return res.sendFile(path.join(clientDist, 'index.html'), (error) => error && next());
});

app.listen(port, () => console.log(`To-do API ready at http://localhost:${port}`));
