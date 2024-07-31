const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

// Definindo a chave JWT usando variável de ambiente
const JWT_KEY = process.env.JWT_KEY || 'your_jwt_secret_key'; // Substitua pelo seu segredo real

module.exports = app => {
  const db = require('../../config/database'); // Ajuste o caminho conforme necessário

  // Função para gerar token
  const generateToken = (params = {}) => {
    return jwt.sign(params, JWT_KEY, {
      expiresIn: 86400, // 24 horas
    });
  };

  // Função de registro
  const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.get(query, [email], async (err, existingUser) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: 'Database query error' });
        }

        if (existingUser) {
          return res.status(400).send({ error: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = `
          INSERT INTO users (name, email, password)
          VALUES (?, ?, ?)
        `;
        db.run(insertQuery, [name, email, hashedPassword], function(err) {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Registration failed.' });
          }

          const user = { id: this.lastID, name, email }; // Você pode querer buscar o usuário no banco de dados
          res.status(201).send({
            user,
            token: generateToken({ id: user.id }),
          });
        });
      });
    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: 'Registration failed.' });
    }
  };

  // Função de autenticação
  const auth = async (req, res) => {
    const { email, password } = req.body;

    try {
      const query = 'SELECT id, password FROM users WHERE email = ?';
      db.get(query, [email], async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: 'Database query error' });
        }

        if (!user) {
          return res.status(400).send({ error: 'User not found.' });
        }

        if (!await bcrypt.compare(password, user.password)) {
          return res.status(400).send({ error: 'Invalid password.' });
        }

        res.send({
          user: { id: user.id },
          token: generateToken({ id: user.id }),
        });
      });
    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: 'Authentication failed.' });
    }
  };

  // Função para obter perfil do usuário
  const userProfile = async (req, res) => {
    const query = 'SELECT id, name, email FROM users WHERE id = ?';
    db.get(query, [req.userId], (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: 'Database query error' });
      }
      if (!user) {
        return res.status(404).send({ error: 'User not found.' });
      }
      res.send({ ok: true, user });
    });
  };

  // Função para esqueci a senha
  const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      const query = 'SELECT id FROM users WHERE email = ?';
      db.get(query, [email], (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: 'Database query error' });
        }

        if (!user) {
          return res.status(400).send({ error: 'User not found.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        const updateQuery = 'UPDATE users SET passwordResetToken = ?, passwordResetExpires = ? WHERE id = ?';
        db.run(updateQuery, [token, now, user.id], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Database update error' });
          }

          mailer.sendMail({
            from: 'your-email@example.com',
            to: email,
            subject: 'Link para Resetar sua Senha ✔',
            text: `Utilize o token ${token} para resetar sua senha`,
          }, (err) => {
            if (err) {
              console.error(err);
              return res.status(400).send({ error: 'Cannot send forgot password email' });
            }

            return res.status(200).send({ message: 'Email sent successfully' });
          });
        });
      });
    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: 'Error on forgot password, try again' });
    }
  };

  // Função para resetar a senha
  const resetPassword = async (req, res) => {
    const { email, token, password } = req.body;

    try {
      const query = 'SELECT id, passwordResetToken, passwordResetExpires FROM users WHERE email = ?';
      db.get(query, [email], async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: 'Database query error' });
        }

        if (!user) {
          return res.status(400).send({ error: 'User not found.' });
        }

        if (token !== user.passwordResetToken) {
          return res.status(400).send({ error: 'Token invalid.' });
        }

        const now = new Date();

        if (now > new Date(user.passwordResetExpires)) {
          return res.status(400).send({ error: 'Token expired, generate a new token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updateQuery = 'UPDATE users SET password = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE id = ?';
        db.run(updateQuery, [hashedPassword, user.id], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Database update error' });
          }

          res.status(200).send({ message: 'Password updated successfully' });
        });
      });
    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: 'Cannot reset password, try again.' });
    }
  };

  return { register, auth, userProfile, forgotPassword, resetPassword };
};
