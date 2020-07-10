const User = require('../models/user.model.js');

module.exports = async (req, res, next) => {
  const decodedToken = req.token;

  if (!decodedToken) {
    return res.sendStatus(401);
  } else {
    const userRecord = await User.findById(decodedToken.id);
    req.currentUser = userRecord;
    if (!userRecord || !userRecord.is_validated || userRecord.is_deleted) {
      return res.sendStatus(401);
    } else {
      return next();
    }
  }
};