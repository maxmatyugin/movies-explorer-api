const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createProfile, login, getProfile, updateProfile,
} = require('../controllers/users');

usersRouter.post('/signup', createProfile);
usersRouter.post('/signin', login);

usersRouter.get('/users/me', auth, getProfile);
usersRouter.patch('/users/me', auth, updateProfile);

module.exports = usersRouter;
