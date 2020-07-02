require('dotenv').config();
const User = require('../models/user.model.js');
const nodemailer = require('nodemailer');

const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

async function sendEmail (data) {
  // Convertion d'un string en bouléen
  const isSecureConnection = (process.env.EMAIL_SMTP_SECURE === 'true');

  // Création du "transporteur" pour l'envoi d'emails
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: parseInt(process.env.EMAIL_SMTP_PORT), // 587
    secure: isSecureConnection, // process.env.EMAIL_SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS // generated ethereal password
    }
  });

  try {
    const emailBody = {
      from: 'Freelance Lyonnais <no_reply@no.reply>',
      to: `${data.firstname} ${data.lastname} ${data.email}`,
      subject: 'Freelance Lyonnais - Le processus de ton inscription est bientôt terminé !',
      Text: `******* **** ***Cher(e) Freelance Lyonnais,
      Nous te remercions pour ton inscription sur notre site.
      Il ne te reste plus qu'à valider ton adresse email en collant le lien ci-dessous dans ton navigateur :
      Toute l'équipe de Freelance Lyonnais te remercie.

      "${process.env.EMAIL_DESTINATION_URL}${data.email}_${data.key}"`,

      html: `<p>Cher(e) Freelance Lyonnais,</Il>
      <p>Nous te remercions pour ton inscription sur notre site.</p>
      <p>Il ne te reste plus qu'à valider ton adresse email en copiant ou cliquant sur le lien ci-dessous :</p>
      <a href=${process.env.EMAIL_DESTINATION_URL}${data.email}/${data.key}>Vérification email</a>
      <p>Toute l'équipe de Freelance Lyonnais te remercie.</p>`
    };
    await transporter.sendMail(emailBody);
    return console.log('Email envoyé');
  } catch (error) {
    return console.log('Erreur', error);
  }
}

class UsersController {
  static async create (req, res) {
    let user = req.body;
    if (!user.email || !user.firstname || !user.lastname || !user.siret) {
      return res.status(422).send({ errorMessage: 'Content can not be empty!' });
    }
    if (!validateEmail(user.email)) {
      return res.status(422).send({ errorMessage: 'A valid email is required !' });
    }
    try {
      const userAlreadyExists = await User.emailAlreadyExists(user.email);
      if (userAlreadyExists) {
        res.status(400).send({ errorMessage: 'A user with this email already exists !' });
      } else {
        user = { ...user, is_validated: 0 };
        const data = await User.create(user);
        await sendEmail(data);
        res.status(201).send(data);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the User.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await User.getAll()).map(c => c);
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving users.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await User.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `User with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error retrieving User with id ' + req.params.id });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await User.updateById(req.params.id, (req.body));
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `User with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating User with id ' + req.params.id });
      }
    }
  }

  static async delete (req, res) {
    try {
      await User.remove(req.params.id);
      res.send({ message: 'User was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: 'Could not delete User with id ' + req.params.id
        });
      }
    }
  }

  static async validationByEmail (req, res) {
    const { email, key } = req.params;
    if (!validateEmail(email)) {
      return res.status(422).send({ errorMessage: 'Il faut une adresse email valide !' });
    }

    try {
      const userExists = await User.emailAlreadyExists(email);
      if (!userExists) {
        res.status(400).send({ errorMessage: 'Adresse email inexistante' });
      } else {
        let user = await User.findByEmail(email);
        if (key === user.key) {
          console.log('Clés identiques !');
          user = { ...user, is_validated: 1 };
          await User.updateById(user.id, user);
          res.sendStatus(200);
        } else {
          console.log('Clés différentes !');
          res.sendStatus(403);
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage: err.message || "Des erreurs se sont produites lors de la validation d'un nouvel utilisateur."
      });
    }
  }
}

module.exports = UsersController;
