require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
const extractToken = require('./middlewares/extractToken');



const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 3001 : 3000);
app.use(express.urlencoded({ extended: true }));
app.use(extractToken);

// middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

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
