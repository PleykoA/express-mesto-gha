const userRoutes = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require('../middlewares/validation');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:userId', validationUserId, getUserById);
userRoutes.patch('/me', validationUpdateUser, updateUser);
userRoutes.patch('/me/avatar', validationUpdateAvatar, changeAvatar);
module.exports = userRoutes;
