const router = require('express').Router();
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

router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate(getUserByIdValidation), getUserById);
router.patch('/me', celebrate(editProfileValidation), updateUser);
router.patch('/me/avatar', celebrate(updateAvatarValidation), changeAvatar);

module.exports = router;
