const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectando ao banco de dados SQLite (cria o arquivo se não existir)
const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite', err.message);
    } else {
        console.log('Conectado ao SQLite');
    }
});

// Função para criar tabelas
const createTables = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                user INTEGER
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                project INTEGER,
                assignedTo INTEGER,
                FOREIGN KEY(project) REFERENCES projects(id)
            )
        `);
    });
};

createTables();

module.exports = db;
