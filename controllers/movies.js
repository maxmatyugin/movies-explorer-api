const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');
const { NotFoundMessage, badRequestMessage, forbiddenMessage } = require('../errors/error-messages');
const Movie = require('../models/movie');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then(() => res.status(200).send({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NotFoundMessage);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden(forbiddenMessage);
      }
      res.status(200).send({ message: 'Фильм удален' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(error);
    })
    .catch(next);
};
