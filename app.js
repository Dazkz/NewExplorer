require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');


const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const errMessages = require('./consts/errorMessages');
const config = require('./config/config');

const app = express();

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_URL : config.dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());
app.use(limiter);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(5),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

app.use('/:someRequest', (req, res, next) => {
  next(new NotFoundError(errMessages.notFoundErr));
});

app.use(errorLogger);

app.use(errors()); // celebrate error

app.use(error);

module.exports = app;
