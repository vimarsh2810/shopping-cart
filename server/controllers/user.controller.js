const { responseObj } = require("../helpers/responseObj");
const { User } = require("../models/user");

exports.getUserData = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    res.status(200).json(responseObj(true, 'Logged in user data', user));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};