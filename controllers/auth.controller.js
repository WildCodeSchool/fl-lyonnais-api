const User = require('../models/user.model.js');
const Freelance = require('../models/freelance.model.js');
class authController {
  static async login (req, res) {
    const clientPayload = req.body;
    try {
      const { token, user, data } = await User.login(clientPayload.email, clientPayload.password);
      const freelance = await Freelance.findByUserId(user.id);
      const freelance_id = freelance ? freelance.id : null;
      if (user.is_deleted || !user.is_validated) {
        res.status(403).send('Access denied, your account has been blocked or you didn t validate your email');
      } else {
        res.status(200).send({ token, user: { ...user, password: '', freelance_id }, data });
      }
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: 'invalid credentials' });
    }
  }
}

module.exports = authController;
