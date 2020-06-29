const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
// const email = require('./email.js');
const nodemailer = require('nodemailer');
require('dotenv').config();

// NodeMailer : create fake account at Ethereal
// const testAccount = await nodemailer.createTestAccount();
// console.log(testAccount);

// Creation of the email transporter
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USER, // generated ethereal user
//     pass: process.env.EMAIL_PASS // generated ethereal password
//   }
// });

console.log('> Transporter created');

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 3001 : 3000);
app.use(express.urlencoded({ extended: true }));

// middlewares
// app.use((req, res, next) => {
//   req.transporter = transporter;
//   console.log('Middleware transporter');
//   next();
// });

app.use((req, res, next) => {
  console.log('loggggggggggggggggg');
  next();
});

app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use('/user', require('./routes/user.routes.js'));
app.use('/freelance', require('./routes/freelance.routes.js'));

// set port, listen for requests
const server = app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

module.exports = server;
