require('dotenv').config();
const nodemailer = require('nodemailer');

// const email = require('./email.js');

// NodeMailer : create fake account at Ethereal
// A décommenter pour créer un compte de test sur Ethereal
// Seulement la première fois, puis stocker les info nécessaires à la connexion
/* const testAccount = await nodemailer.createTestAccount();
console.log(testAccount); */

// Creation of the email transporter
const initTransporter = (req, res, next) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: process.env.EMAIL_SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS // generated ethereal password
    }
  });
  res.json({ ...transporter });
  console.log('---------------------------------------------------');
  console.log('> Transporter created', res);
  
  next();
};

module.exports = initTransporter;

// middlewares
// app.use((req, res, next) => {
//   req.transporter = transporter;
//   console.log('Middleware transporter');
//   next();
// });

/* router.post('/sendemail/:id', (req, res, next) => {
  req.transporter = transporter;
  console.log('Middleware transporter');
  next();
}, usersController.sendEmail); */

