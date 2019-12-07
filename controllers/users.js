require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadReq = require('../errors/badReq');
const errMessages = require('../consts/errorMessages');
const config = require('../config/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, name, password: passWord } = req.body;
  bcrypt.hash(passWord, 10)
    .then((hash) => User.create({ email, name, password: hash })
      .then((user) => {
        const {
          __v, password, _id, ...userData
        } = user._doc;
        return userData;
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new BadReq(errMessages.alreadyExistMsg));
        } else {
          next(new BadReq(errMessages.badReqErrorMessage));
        }
      }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : config.secretJWT,
        { expiresIn: '7d' });
      res.cookie('jwt', token, { htmlOnly: true });
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => next(new NotFoundError(errMessages.notFoundErr)));
};
