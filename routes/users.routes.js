const usersController = require('../controllers/users.controller.js');
const router = require('express').Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

router.post('/', usersController.create);
router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

router.post('/sendemail/:id', (req, res, next) => {
  req.transporter = transporter;
  console.log('Middleware transporter');
  next();
}, usersController.sendEmail);

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS // generated ethereal password
  }
});

module.exports = router;
