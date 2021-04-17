const router = require('express').Router();
const auth = require('../middlewares/auth');
const { notFoundMessage } = require('../errors/error-messages');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.use(usersRouter, moviesRouter);
router.use(auth, () => {
  throw new NotFoundError(notFoundMessage);
});

module.exports = router;
