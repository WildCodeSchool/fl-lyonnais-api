require('dotenv').config();
const nodemailer = require('nodemailer');

// const email = require('./email.js');

// NodeMailer : create fake account at Ethereal
/* const testAccount = await nodemailer.createTestAccount();
console.log(testAccount); */

// Creation of the email transporter
const initTransporter = (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: process.env.EMAIL_SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS // generated ethereal password
    }
  });
  console.log('> Transporter created');
  return transporter;
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

/* const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS // generated ethereal password
  }
}); */
