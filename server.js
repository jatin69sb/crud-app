// server.js
// A simple Express server that exposes a CRUD REST API for "tasks"
// and serves a small frontend from the /public folder.

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());               // parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend

// ---------- CRUD API ROUTES ----------

// CREATE: add a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, status } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const stmt = db.prepare(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)'
  );
  const result = stmt.run(title, description || '', status || 'pending');

  const newTask = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(newTask);
});

// READ: get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
  res.json(tasks);
});

// READ: get a single task by id
app.get('/api/tasks/:id', (req, res) => {
  const task = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// UPDATE: edit an existing task
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status } = req.body;
  const existing = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updated = {
    title: title !== undefined ? title : existing.title,
    description: description !== undefined ? description : existing.description,
    status: status !== undefined ? status : existing.status,
  };

  db.prepare(
    'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?'
  ).run(updated.title, updated.description, updated.status, req.params.id);

  const result = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(req.params.id);

  res.json(result);
});

// DELETE: remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
