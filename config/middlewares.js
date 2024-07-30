const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app => {
  app.use(bodyParser.json()); // Permite o parsing de JSON
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
};
