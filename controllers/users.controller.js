require('dotenv').config();
const User = require('../models/user.model.js');
const nodemailer = require('nodemailer');
const randkey = require('random-keygen');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Le freelance a 48 heures pour valider son adresse email...
// Vérification de ce délai
// Attention : ajouter 24 heures à la durée souhaitée (p.e. : 72 pour 48 h).
function onTimeForValidation (user) {
  const twoDaysAgo = new Date(new Date(Date.now() - (72 * 60 * 60 * 1000)).toISOString().slice(0, 10));
  const registrationDate = user.registration_date; // .substring(0, 10);
  return twoDaysAgo <= registrationDate;
}

// Création du transporteur pour l'envoi d'mails (NodeMailer)
async function sendEmail (data) {
  // Transporteur
  const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  /* const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: parseInt(process.env.EMAIL_SMTP_PORT), // 587
    secure: isSecureConnection, // process.env.EMAIL_SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // User
      pass: process.env.EMAIL_PASS, // Password
      clientId: process.env.EMAIL_SMTP_CLIENT_ID,
      clientSecret: process.env.EMAIL_SMTP_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_SMTP_REFRESH_TOKEN,
      accessToken: process.env.EMAIL_SMTP_ACCESS_TOKEN,
      expires: process.env.EMAIL_SMTP_EXPIRES
    }
  }); */

  try {
    const emailBody = {
      from: 'Pierre Ammeloot <pierre@ammeloot.fr>',
      to: `${data.firstname} ${data.lastname} ${data.email}`,
      subject: 'Annuaire des Freelances Lyonnais - Le processus d’inscription est bientôt terminé',
      Text: `Cher(e) Freelance Lyonnais,
      Nous te remercions pour ton inscription sur l’annuaire des Freelances Lyonnais.
      Il ne te reste plus qu'à valider ton adresse email en collant le lien ci-dessous dans ton navigateur :
      A bientôt,
      Pierre.

      "${process.env.BASE_URL}/users/validation_email?email=${data.email}&key=${data.key}"`,

      html: `<p>Cher(e) Freelance Lyonnais,</Il>
      <p>Nous te remercions pour ton inscription sur l’annuaire des Freelances Lyonnais.</p>
      <p>Il ne te reste plus qu'à valider ton adresse email en copiant ou cliquant sur le lien ci-dessous :</p>
      <a href="${process.env.BASE_URL}/users/validation_email?email=${data.email}&key=${data.key}">Vérification email</a>
      <p>À bientôt,</p>
      <p>Pierre</p>`
    };
    await transporter.sendMail(emailBody);
    return console.log('Email envoyé');
  } catch (error) {
    return console.error('Erreur', error);
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
        // Récupère la date du jour
        const registrationDate = new Date().toISOString().slice(0, 10);
        // création d'une clé de 20 caractères
        const key = randkey.get({
          length: 20,
          numbers: true,
          uppercase: true
        });
        // Ajout des clés dans l'objet passé pour la création du tuple dans la table 'user'
        user = {
          ...user,
          registration_date: registrationDate,
          is_validated: 0,
          key: key
        };
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

  static async login (req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('User not found!');
      } else {
        const passwordMatch = await argon2.verify(user.password, password);
        if (passwordMatch) {
          const token = jwt.sign({ id: user.id, sub: user.name }, process.env.JWT_PRIVATE_KEY);
          return Promise.resolve(token);
        } else {
          throw new Error('Password is not matching.');
        }
      }
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found User with this email .'
        });
      } else {
        res.status(500).send({
          message: 'Could not found User with this email'
        });
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
    const { email, key } = req.query;
    if (!validateEmail(email)) {
      return res.status(422).send({ errorMessage: 'Il faut une adresse email valide !' });
    }
    //
    try {
      let user = await User.findByEmail(email);
      if (!user) {
        // Erreur : l'adresse email n'est pas présente dans la table user
        res.status(400).send({ errorMessage: 'Adresse email inexistante' });
      } else if (user.is_validated) {
        // Erreur : tentative de revalidation d'un compte déjà validé
        res.redirect(process.env.BASE_URL_FRONT + '/connexion?statut=revalidation');
      } else {
        const isOnTime = onTimeForValidation(user);
        if ((key === user.key) && isOnTime) {
          // OK : email, clé et date sont valides
          console.log('Clés identiques !');
          user = { ...user, is_validated: 1 };
          await User.updateById(user.id, user);
          res.redirect(process.env.BASE_URL_FRONT + '/connexion?statut=validated');
        } else if (!isOnTime) {
          // Erreur : le délai de réponse est dépassé
          console.log('Délai dépassée...');
          res.redirect(process.env.BASE_URL_FRONT + '/connexion?statut=delay_exceeded');
        } else {
          // Erreur : les clés sont différentes
          console.log('Clés différentes !');
          res.redirect(process.env.BASE_URL_FRONT + '/connexion?statut=wrong_key');
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage: err.message || "Des erreurs se sont produites lors de la validation d'un nouvel utilisateur."
      });
    }
  }

  // Lorsque le freelance nouvellement inscrit n'a pas répondu dans les temps
  // Il en est informé lorsqu'il arrive sur la page de validation
  // S'il redonne son email (celui-ci doit être le même que celui donné lors de l'inscription),
  // on lui renvoi un nouvel email avec une nouvelle clé (la date d'inscription est actualisée à la date du jour)
  static async resendValidationEmail (req, res) {
    const { email } = req.query;
    if (!validateEmail(email)) {
      return res.status(422).send({ errorMessage: 'Il faut une adresse email valide !' });
    }
    try {
      let user = await User.findByEmail(email);
      if (user) {
        // Récupère la date du jour
        const registrationDate = new Date().toISOString().slice(0, 10);
        // création d'une nouvelle clé de 20 caractères
        const key = randkey.get({
          length: 20,
          numbers: true,
          uppercase: true
        });
        user = {
          ...user,
          is_validated: 0,
          registration_date: registrationDate,
          key: key
        };
        // Mise à jour des données de l'utilisateur (clé, date, etc.)
        await User.updateById(user.id, user);
        // Envoi de l'email de validation
        await sendEmail(user);
        res.status(201).send(user);
      } else {
        res.status(403).send("L'adresse email est erronée");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage: err.message || "Des erreurs se sont produites lors du renvoi d'un email de validation."
      });
    }
  }
}

module.exports = UsersController;
