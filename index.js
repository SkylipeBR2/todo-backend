const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./tasks.db');

app.use(cors());
app.use(express.json());

db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT, completed INTEGER)');

// GET all tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => res.json(rows));
});

// POST new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, 0], function () {
    res.json({ id: this.lastID, title, completed: 0 });
  });
});

// PUT update task
app.put('/tasks/:id', (req, res) => {
  const { title, completed } = req.body;
  db.run('UPDATE tasks SET title = ?, completed = ? WHERE id = ?', [title, completed, req.params.id], () => {
    res.sendStatus(200);
  });
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], () => {
    res.sendStatus(200); c
  });
});

app.listen(3001, () => console.log('Backend on http://localhost:3001'));
