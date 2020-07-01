require('dotenv').config();
const nodemailer = require('nodemailer');

// const email = require('./email.js');
// const nodemailer = require('nodemailer');

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
