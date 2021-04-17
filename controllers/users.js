const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  NotFoundMessage,
  badRequestMessage,
  conflictMessage,
  unauthorizedMessage,
} = require('../errors/error-messages');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(badRequestMessage);
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(unauthorizedMessage);
      }
      return bcrypt.compare(password, user.password)
        .then((isPasswordEqual) => {
          if (!isPasswordEqual) {
            throw new BadRequestError(badRequestMessage);
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.createProfile = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError(badRequestMessage);
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(200).send({ name, email });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(conflictMessage);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      if (err) {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NotFoundMessage);
      }
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError(badRequestMessage);
  }

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NotFoundMessage);
      }
      res.send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(badRequestMessage);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};
