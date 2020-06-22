require('dotenv').config();
const nodemailer = require('nodemailer');

class Email {
  init () {
    let config = {
      host: process.env.EMAIL_SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_SMTP_PORT) || 587,
      secure: parseInt(process.env.EMAIL_SMTP_SECURE) || 0,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    };

    if (process.env.NODE_ENV === 'test') {
      config = {
        host: process.env.EMAIL_SMTP_HOST_TEST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_SMTP_PORT_TEST) || 587,
        secure: parseInt(process.env.EMAIL_SMTP_SECURE_TEST) || 0,
        user: process.env.EMAIL_USER_TEST,
        pass: process.env.EMAIL_PASS_TEST
      };
    }

    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for other ports
      auth: {
        user: config.user, // generated ethereal user
        pass: config.pass // generated ethereal password
      }
    });
    return this;
  }
}

module.exports = (new Email()).init();
