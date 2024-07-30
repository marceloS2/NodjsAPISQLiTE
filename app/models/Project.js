const db = require('../../config/database');

// Função para criar a tabela de projetos, se não existir
const createTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      user INTEGER,
      FOREIGN KEY(user) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela de projetos:', err.message);
    } else {
      console.log('Tabela de projetos criada ou já existe');
    }
  });
};

// Criar a tabela ao iniciar o arquivo
createTable();

// Funções para manipular a tabela de projetos
const createProject = (project, callback) => {
  const { title, description, user } = project;
  const query = `INSERT INTO projects (title, description, user) VALUES (?, ?, ?)`;
  db.run(query, [title, description, user], function(err) {
    if (err) {
      console.error('Erro ao criar projeto:', err.message);
      callback(err);
    } else {
      callback(null, { id: this.lastID });
    }
  });
};

const getProjects = (callback) => {
  const query = 'SELECT * FROM projects';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao obter projetos:', err.message);
      callback(err);
    } else {
      callback(null, rows);
    }
  });
};

const getProjectById = (id, callback) => {
  const query = 'SELECT * FROM projects WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Erro ao obter projeto:', err.message);
      callback(err);
    } else {
      callback(null, row);
    }
  });
};

const updateProject = (id, project, callback) => {
  const { title, description, user } = project;
  const query = `UPDATE projects SET title = ?, description = ?, user = ? WHERE id = ?`;
  db.run(query, [title, description, user, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar projeto:', err.message);
      callback(err);
    } else {
      callback(null, { changes: this.changes });
    }
  });
};

const removeProject = (id, callback) => {
  const query = 'DELETE FROM projects WHERE id = ?';
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Erro ao deletar projeto:', err.message);
      callback(err);
    } else {
      callback(null, { changes: this.changes });
    }
  });
};

// Exportar funções para uso em controladores
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  removeProject
};