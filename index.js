const express = require('express');
const consign = require('consign');

// Definindo a porta como 192.168.3.6:8080
const PORT = 8080;

const app = express();

consign()
  .include('./app/middlewares/authToken.js')
  .then('./config/middlewares.js')
  .then('./app/models/')
  .then('./app/controllers')
  .then('./routes/routes.js')
  .into(app);

app.listen(PORT, '192.168.3.6', () => {
  console.log(`Servidor online na porta ${PORT}`);
});
