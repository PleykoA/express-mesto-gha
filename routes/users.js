const userRouter = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUserByIdValidation,
  editProfileValidation,
  updateAvatarValidation,
} = require('../middlewares/validation');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  getMe,
  changeAvatar,
} = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/me', getMe);
userRouter.get('/:userId', celebrate(getUserByIdValidation), getUserById);
userRouter.patch('/me', celebrate(editProfileValidation), updateUser);
userRouter.patch('/me/avatar', celebrate(updateAvatarValidation), changeAvatar);

module.exports = userRouter;
