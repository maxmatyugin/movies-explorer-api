const moviesRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { getSavedMovies, saveMovie, deleteMovieById } = require('../controllers/movies');
const { saveMovieValidation, deleteMovieByIdValidation } = require('../middlewares/validation');

moviesRouter.get('/movies', auth, getSavedMovies);
moviesRouter.post('/movies', saveMovieValidation, auth, saveMovie);
moviesRouter.delete('/movies/:movieId', deleteMovieByIdValidation, auth, deleteMovieById);

module.exports = moviesRouter;
