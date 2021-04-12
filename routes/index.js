const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use(usersRouter, moviesRouter);

module.exports = router;
