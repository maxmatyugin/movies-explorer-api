const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const User = require('../models/user');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан емейл или пароль');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неверный емейл или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((isPasswordEqual) => {
          if (!isPasswordEqual) {
            throw new BadRequestError('Неверный емейл или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.send({ token, name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.createProfile = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан емейл или пароль');
  }
  if (!name) {
    throw new BadRequestError('Введите имя');
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError('Такой пользователь уже существует');
      }
      if (err) {
        throw new BadRequestError('Введены невалидные данные');
      }
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'castError') {
        throw new BadRequestError('Пользователь не найден');
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError('Не переданы данные');
  }

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next(err);
    })
    .catch(next);
};
