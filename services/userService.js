
const userController = require('../controllers/userController');

const getUser = async (req, res) => {
  const { query: { access_token }} = req;
  
  if (!access_token) {
    res.status(400).send('Access Token required');
    return;
  }

  const { user, error } = await userController.getUser(access_token);
  
  if (error) {
    res.status(error.code).json(error.errors);
  }
  else {
    res.status(200).json(user);
  }
}

module.exports = {
  getUser,
}