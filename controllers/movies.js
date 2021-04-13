const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');
const Movie = require('../models/movie');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Фильмы не найдены');
      }
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
    .then((movie) => res.status(200).send(movie))
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

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с таким id не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Невозможно удалить фильм, сохраненный другим пользователем');
      }
      res.status(200).send({ message: 'Фильм удален' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Не удалось удалить фильм');
      }
      next(error);
    })
    .catch(next);
};
