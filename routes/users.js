const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createProfile, login, getProfile, updateProfile,
} = require('../controllers/users');
const { loginValidation, registerValidation, updateProfileValidation } = require('../middlewares/validation');

usersRouter.post('/signup', registerValidation, createProfile);
usersRouter.post('/signin', loginValidation, login);

usersRouter.get('/users/me', auth, getProfile);
usersRouter.patch('/users/me', updateProfileValidation, auth, updateProfile);

module.exports = usersRouter;
