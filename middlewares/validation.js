const { celebrate, Joi } = require('celebrate');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

const registerValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().unique(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const saveMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().trim().required(),
    director: Joi.string().trim().required(),
    duration: Joi.number().required(),
    year: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().regex(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/).required(),
    trailer: Joi.string().trim().regex(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/).required(),
    thumbnail: Joi.string().trim().regex(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().trim().required(),
    nameEN: Joi.string().trim().required(),
  }),
});

const deleteMovieByIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().trim()
      .hex()
      .length(24),
  }),
});

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  loginValidation,
  registerValidation,
  saveMovieValidation,
  deleteMovieByIdValidation,
  updateProfileValidation,
};
