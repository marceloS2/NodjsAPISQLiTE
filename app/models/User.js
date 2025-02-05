const bcrypt = require('bcryptjs');
const db = require('../../config/database'); // Atualize o caminho conforme necessário

// Função para criar a tabela de usuários
const createUserTable = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                passwordResetToken TEXT,
                passwordResetExpires DATETIME,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                isAdmin BOOLEAN DEFAULT FALSE
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    });
};

createUserTable();

// Função para criar um novo usuário
const createUser = async (user) => {
    const { name, email, password, isAdmin } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO users (name, email, password, isAdmin)
            VALUES (?, ?, ?, ?)
        `, [name, email, hashedPassword, isAdmin], function(err) {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID });
        });
    });
};

// Função para encontrar um usuário por e-mail
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT * FROM users WHERE email = ?
        `, [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

// Função para encontrar um usuário por ID
const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT * FROM users WHERE id = ?
        `, [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

// Função para atualizar um usuário
const updateUser = async (id, updates) => {
    const { name, email, password, isAdmin } = updates;
    let query = 'UPDATE users SET ';
    const params = [];

    if (name) {
        query += 'name = ?, ';
        params.push(name);
    }
    if (email) {
        query += 'email = ?, ';
        params.push(email);
    }
    if (password) {
        query += 'password = ?, ';
        params.push(await bcrypt.hash(password, 10)); // Criptografa a nova senha
    }
    if (typeof isAdmin === 'boolean') {
        query += 'isAdmin = ?, ';
        params.push(isAdmin);
    }

    query = query.slice(0, -2); // Remove a última vírgula e espaço
    query += ' WHERE id = ?';
    params.push(id);

    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                return reject(err);
            }
            resolve({ changes: this.changes });
        });
    });
};

// Função para remover um usuário
const removeUser = (id) => {
    return new Promise((resolve, reject) => {
        db.run(`
            DELETE FROM users WHERE id = ?
        `, [id], function(err) {
            if (err) {
                return reject(err);
            }
            resolve({ changes: this.changes });
        });
    });
};

module.exports = { createUser, findUserByEmail, findUserById, updateUser, removeUser };
