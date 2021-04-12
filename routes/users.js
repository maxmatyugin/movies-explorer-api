const usersRouter = require('express').Router();
const {
  createProfile, login, getProfile, updateProfile,
} = require('../controllers/users');

usersRouter.post('/signup', createProfile);
usersRouter.post('/signin', login);

usersRouter.get('/users/me', getProfile);
usersRouter.patch('/users/me', updateProfile);

module.exports = usersRouter;
