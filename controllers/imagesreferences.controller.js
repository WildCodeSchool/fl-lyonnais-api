const Freelance = require('../models/freelance.model.js');
const User = require('../models/user.model.js');
const Image = require('../models/image.model.js');
const Reference = require('../models/reference.model.js');
const FreelanceReference = require('../models/freelance_reference.model.js');
const ImageReference = require('../models/reference_image.model.js');

class ImageReferencesController {

  static async update (req, res) {
    // const { email, street, zip_code, city, country, url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, references, chosenTags } = req.body;
    const imagesReceivedFiles = req.files 
    const imagesReceivedBody= req.body;
    console.log(' imagesReceivedFiles', imagesReceivedFiles)
    console.log('imagesReceivedBody',req.body)

    if (!req.file) {
      res.status(400).send({ errorMessage: 'Image content can not be empty!' });
    }

      //1
      const user = req.currentUser
      const user_id = user.id;
      req.body.country = 'France';
      const freelance = await Freelance.findByUserId(user.id);
      const freelance_id = freelance.id
      console.log('références', freelance_id)


      await FreelanceReference.removeAllReferences(freelance.id);
      let referencesToSendToClient = []
      for (let i=0; i<= imagesReceivedBody.referenceID.length; i++) {
        let  name = imagesReceivedBody.name[i];
        let  image = imagesReceivedFiles[i].path;
        let  url = imagesReceivedBody.url[i];

        const reference = await Reference.create({ name, image, url });// ni img ni url pour l'instant
        await FreelanceReference.create({ reference_id: reference.id, freelance_id: freelance.id });  
        referencesToSendToClient.push(reference)
      }
      res.send(referencesToSendToClient);
      

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

module.exports = ImageReferencesController;
