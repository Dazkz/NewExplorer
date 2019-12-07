const routerUsers = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getUser } = require('../controllers/users');

routerUsers.get('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), getUser);

module.exports = routerUsers;
