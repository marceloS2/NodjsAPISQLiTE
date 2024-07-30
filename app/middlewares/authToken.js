const jwt = require('jsonwebtoken');

// Definindo a chave JWT diretamente
const JWT_KEY = 'your_jwt_secret_key'; // Substitua pelo seu segredo real

module.exports = () => {
  const authenticationJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ error: 'Token não informado' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).send({ error: 'Erro no token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).send({ error: 'Token malformatado' });
    }

    jwt.verify(token, JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: 'Token inválido' });
      }

      req.userId = decoded.id;
      next();
    });
  };

  return { authenticationJWT };
};
