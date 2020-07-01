const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 3001 : 7777);
app.use(express.urlencoded({ extended: true }));

// middlewares
app.use((req, res, next) => {
  console.log('loggggggggggggggggg');
  next();
});

app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use('/users', require('./routes/users.routes.js'));
app.use('/freelances', require('./routes/freelances.routes.js'));
app.use('/tags', require('./routes/tags.routes'));

// set port, listen for requests
const server = app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

module.exports = server;
