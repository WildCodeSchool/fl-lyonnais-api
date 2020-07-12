const Freelance = require('../models/freelance.model.js');
const User = require('../models/user.model.js');
const Image = require('../models/image.model.js');
const Reference = require('../models/reference.model.js');
const FreelanceReference = require('../models/freelance_reference.model.js');
const moment = require('moment');

class ImagesController {

  static async update (req, res) {
    // const { email, street, zip_code, city, country, url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, references, chosenTags } = req.body;
    const image = req.file ? req.file.path : null

    if (!req.file) {
      res.status(400).send({ errorMessage: 'Image content can not be empty!' });
    }
    //Upload de la photo de profil
    //1 récupérer le fl id
    //2 faire un update juste sur la photo
      //1
      const user = req.currentUser
      const user_id = user.id;
      req.body.country = 'France';
      const freelance = await Freelance.findByUserId(user.id);
      const freelance_id = freelance.id
      console.log(freelance_id)

      //2 
      // Table Ref Tags
      // table freelance
      const dataFreelanceImage = await Image.updateById(freelance_id, {url_photo: image});
      console.log(dataFreelanceImage)

      res.send(dataFreelanceImage);
    } catch (err) {
      console.error(err)
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelance with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating Freelance with id ' + req.params.id });
      }
    }
  

  // static async delete (req, res) {
  //   const { deleted } = req.query;
  //   if (!req.body) {
  //     res.status(400).send({ errorMessage: 'Content can not be empty!' });
  //   }
  //   try {
  //     const data = await Freelance.delete(deleted, req.currentUser.id);
  //     res.send({ data });
  //   } catch (err) {
  //     if (err.kind === 'not_found') {
  //       res.status(404).send({ errorMessage: `Freelance with id ${req.params.id} not found.` });
  //     } else {
  //       res.status(500).send({ errorMessage: 'Error updating Freelance with id ' + req.params.id });
  //     }
  //   }
  // }
}

module.exports = ImagesController;
