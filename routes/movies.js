const moviesRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { getSavedMovies, saveMovie, deleteMovieById } = require('../controllers/movies');

moviesRouter.get('/movies', auth, getSavedMovies);
moviesRouter.post('/movies', auth, saveMovie);
moviesRouter.delete('/movies/:movieId', auth, deleteMovieById);

module.exports = moviesRouter;
