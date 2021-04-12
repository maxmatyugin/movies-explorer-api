const moviesRouter = require('express').Router();
const { getSavedMovies, createMovie, deleteMovieById } = require('../controllers/movies');

moviesRouter.get('/movies', getSavedMovies);
moviesRouter.post('/movies', createMovie);
moviesRouter.delete('/movies/movieId', deleteMovieById);

module.exports = moviesRouter;
