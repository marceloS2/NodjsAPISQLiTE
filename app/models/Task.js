const db = require('../../config/database'); // Atualize o caminho conforme necessário

// Função para criar a tabela de tarefas
const createTaskTable = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                project INTEGER,
                assignedTo INTEGER,
                completed BOOLEAN DEFAULT FALSE,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(project) REFERENCES projects(id),
                FOREIGN KEY(assignedTo) REFERENCES users(id)
            )
        `);
    });
};

createTaskTable();

// Função para criar uma nova tarefa
const createTask = (task) => {
    const { title, project, assignedTo, completed } = task;

    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO tasks (title, project, assignedTo, completed)
            VALUES (?, ?, ?, ?)
        `, [title, project, assignedTo, completed], function(err) {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID });
        });
    });
};

// Função para encontrar todas as tarefas
const findAllTasks = () => {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT * FROM tasks
        `, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// Função para encontrar uma tarefa por ID
const findTaskById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT * FROM tasks WHERE id = ?
        `, [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

// Função para atualizar uma tarefa
const updateTask = (id, updates) => {
    const { title, project, assignedTo, completed } = updates;

    return new Promise((resolve, reject) => {
        db.run(`
            UPDATE tasks SET
                title = ?,
                project = ?,
                assignedTo = ?,
                completed = ?
            WHERE id = ?
        `, [title, project, assignedTo, completed, id], function(err) {
            if (err) {
                return reject(err);
            }
            resolve({ changes: this.changes });
        });
    });
};

// Função para remover uma tarefa
const removeTask = (id) => {
    return new Promise((resolve, reject) => {
        db.run(`
            DELETE FROM tasks WHERE id = ?
        `, [id], function(err) {
            if (err) {
                return reject(err);
            }
            resolve({ changes: this.changes });
        });
    });
};

module.exports = { createTask, findAllTasks, findTaskById, updateTask, removeTask };
