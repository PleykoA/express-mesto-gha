const userRouter = require('express').Router();

const {
  getUserByIdValidation,
  editProfileValidation,
  updateAvatarValidation,
} = require('../utils/validation');
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
userRouter.get('/:userId', getUserByIdValidation, getUserById);
userRouter.patch('/me', editProfileValidation, updateUser);
userRouter.patch('/me/avatar', updateAvatarValidation, changeAvatar);

module.exports = userRouter;
