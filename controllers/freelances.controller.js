const Freelance = require('../models/freelance.model.js');
const User = require('../models/user.model.js');
const FreelanceTag = require('../models/freelance_tag.model.js');
const FreelanceRef = require('../models/freelance_reference.model.js');
const Address = require('../models/address.model.js');
const Reference = require('../models/reference.model.js');
const FreelanceReference = require('../models/freelance_reference.model.js');
const moment = require('moment');
const queryString = require('query-string');

class FreelancesController {
  static async get (req, res) {
    const user = req.currentUser;
    const freelance = await Freelance.findByUserId(user.id);

    let references = [];
    let tags = [];
    let address = {};
    if (freelance) {
      references = await Freelance.getAllReferences(freelance.id);
      tags = await Freelance.getAllTags(freelance.id);
      address = await Freelance.getAddress(freelance.id);
    }
    res.status(200).send({ freelance, user, references, tags, address });
  }

  static async create (req, res) {
    // const main_picture_url = req.file ? req.file.path : null
    // const createdpost = await Post.create({main_picture_url})
    try {
      // Destructuration et récparation de l'objet
      req.body.country = 'France';
      const { email, street, zip_code, city, country, url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, references, chosenTags } = req.body;

      // table address
      const dataAddress = await Address.create({ street, zip_code, city, country });
      const address_id = dataAddress.id;

      // table User
      const user = await User.findByEmail(email);
      const user_id = user.id;

      // table freelance
      // const lastModificationDate = new Date().toISOString().slice(0, 10);
      const dataFreelance = await Freelance.create({ url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, address_id, user_id, is_active: 1 });

      // table freelance_tag
      for (let i = 0; i < chosenTags.length; i++) {
        await FreelanceTag.create({ tag_id: chosenTags[i].id, freelance_id: dataFreelance.id });
      }

      // table références
      for (let i = 0; i < references.length; i++) {
        const { name, image, url } = references[i];
        const reference = await Reference.create({ name, image, url });// ni img ni url pour l'instant
        await FreelanceReference.create({ reference_id: reference.id, freelance_id: dataFreelance.id });
      }

      res.status(201).send({ dataFreelance });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the Freelance.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Freelance.getAll()).map(c => c);
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving freelances.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const freelance = await Freelance.findById(req.params.id);
      const tags = await Freelance.getAllTags(req.params.id);
      const references = await Freelance.getAllReferences(req.params.id);
      res.send({ freelance, tags, references });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelance with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error retrieving Freelance with id ' + req.params.id });
      }
    }
  }

  static async update (req, res) {
    const { email, street, zip_code, city, country, url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, references, chosenTags } = req.body;

    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }
    try {
      if (!email) {
        res.status(400).send('No email mannnnn!');
      }
      const user = req.currentUser;
      const user_id = user.id;

      req.body.country = 'France';

      // table freelance
      const freelance = await Freelance.findByUserId(user.id);
      console.log(freelance);
      const dataFreelance = await Freelance.updateById(freelance.id, { ...req.body, last_modification_date: new Date().toISOString().slice(0, 10) });



      // table address
      const dataAddress = await Address.updateById(dataFreelance.address_id, req.body);

      // Table freelance_tags
      // // Delete tags from freelance_tags
      await FreelanceTag.removeAllTags(freelance.id);
      for (let i = 0; i < chosenTags.length; i++) {
        await FreelanceTag.create({ tag_id: chosenTags[i].id, freelance_id: freelance.id });
      }


      // Delete reference_id from freelance_reference
      await FreelanceReference.removeAllReferences(freelance.id);
      for (let i = 0; i < references.length; i++) {
        const { name, image, url } = references[i];
        const reference = await Reference.create({ name, image, url });// ni img ni url pour l'instant
        await FreelanceReference.create({ reference_id: reference.id, freelance_id: freelance.id });
      }

      res.send(dataFreelance);
    } catch (err) {
      console.error(err);
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelance with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating Freelance with id ' + req.params.id });
      }
    }
  }

  // Affichage des freelance par page
  // Paramètres :
  // - page = numéro de la page à envoyer
  // - flperpage = nombre de freelance par page
  static async pagination (req, res) {
    const { page, flperpage, search } = req.query;

    try {
      // Vérification du numéro de semaine et appel à la fonction de mélange si elle a changé
      const memorisedWeekNumber = await Freelance.readWeekNumber();
      const weekNumber = moment().isoWeek();
      if (memorisedWeekNumber[0].week !== weekNumber) {
        await Freelance.randomizeFreelance();
        await Freelance.writeWeekNumber(weekNumber);
      }
      // Calcul de l'offset en fonction du numéro de page et du nombre de vignettes affichées par page
      const offset = (page - 1) * flperpage;
      let freelances = [];
      let freelanceTotalAmount = [];

      if (search[0] === '') {
        // Si la recherche (search) est vide, alors affichage de tous les freelances avec pagination
        freelances = await Freelance.getAllByPage({ offset, flperpage });
        freelanceTotalAmount = await Freelance.totalAmountOfActiveFreelances();
        freelanceTotalAmount = freelanceTotalAmount.map(f => f.totalAmoutOfValidFreelances);
        freelanceTotalAmount = freelanceTotalAmount[0];
      } else {
        // Si des critères de recherche ont été trouvés => recherche avec ces critères
        let resultLength = 0;
        freelances = await Freelance.search(search, flperpage, offset, resultLength);
        resultLength = 1;
        freelanceTotalAmount = await Freelance.search(search, flperpage, offset, resultLength);
        freelanceTotalAmount = freelanceTotalAmount.length;
      }

      const tags = await Promise.all(freelances.map(f => Freelance.getAllTags(f.id)));
      for (let i = 0; i < freelances.length; i++) {
        freelances[i].tags = tags[i];
      }

      res.send({ freelances, freelanceTotalAmount });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving freelances (pagination).'
      });
    }
  }

  static async delete (req, res) {
    const user = req.currentUser;
    const freelance = await Freelance.findByUserId(user.id);
    try {
      const data = await Freelance.delete(1, freelance.id);
      res.send({ data });
    } catch (err) {
      console.error(err)
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelance with id ${freelance.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating Freelance with id ' + freelance.id });
      }
    }
  }

  static async ActivateDeactivate (req, res) {
    const { activated } = req.query;
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }
    try {
      const data = await Freelance.activate(activated, req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelance with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating Freelance with id ' + req.params.id });
      }
    }
  }

  static async setImagesToUploadsFile (req, res) {
    // const { email, street, zip_code, city, country, url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, references, chosenTags } = req.body;
    const image = req.file ? req.file.path : null;

    if (!req.file) {
      res.status(400).send({ errorMessage: 'Image content can not be empty!' });
    }
    res.status(200).send({ image });
  }
}

module.exports = FreelancesController;
