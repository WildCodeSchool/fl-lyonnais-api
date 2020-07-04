require('dotenv').config();
const User = require('../models/user.model.js');
const nodemailer = require('nodemailer');
const randkey = require('random-keygen');

const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
  // Convertion d'un string en bouléen
  const isSecureConnection = (process.env.EMAIL_SMTP_SECURE === 'true');

  // Transporteur
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

      "${process.env.BASE_URL}/users/validation_email/${data.email}_${data.key}"`,

      html: `<p>Cher(e) Freelance Lyonnais,</Il>
      <p>Nous te remercions pour ton inscription sur notre site.</p>
      <p>Il ne te reste plus qu'à valider ton adresse email en copiant ou cliquant sur le lien ci-dessous :</p>
      <a href=${process.env.BASE_URL}/users/validation_email/${data.email}/${data.key}>Vérification email</a>
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
      let user = await User.findByEmail(email);
      if (!user) {
        // Erreur : l'adresse email n'est pas présente dans la table user
        res.status(400).send({ errorMessage: 'Adresse email inexistante' });
      } else if (user.is_validated ) {
        // Erreur : tentative de revalidation d'un compte déjà validé
        console.log('Tentative de revalidation...');
        res.redirect(process.env.BASE_URL_FRONT + '/connexion?status=revalidation');
      } else {
        const isOnTime = onTimeForValidation(user);
        if ((key === user.key) && isOnTime) {
          // OK : email, clé et date sont valides
          console.log('Clés identiques !');
          user = { ...user, is_validated: 1 };
          await User.updateById(user.id, user);
          res.redirect(process.env.BASE_URL_FRONT + '/connexion?status=' + user.key);
        } else if (!isOnTime) {
          // Erreur : le délai de réponse est dépassé
          console.log('Délai dépassée...');
          res.redirect(process.env.BASE_URL_FRONT + '/connexion?status=delay_exceeded');
        } else {
          // Erreur : les clés sont différentes
          console.log('Clés différentes !');
          res.redirect(process.env.BASE_URL_FRONT + '/connexion?status=wrong_key');
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
