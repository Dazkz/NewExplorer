const Articles = require('../models/article');
const NotFoundError = require('../errors/not-found-error');
const BadReq = require('../errors/badReq');
const Forbidden = require('../errors/forbidden');
const errMessages = require('../consts/errorMessages');

module.exports.getArticles = (req, res, next) => {
  Articles.find({ owner: req.user._id })
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError(errMessages.notFoundArticlesMessage);
      }
      return res.status(200).send({ data: articles });
    })
    .catch(next);
};

module.exports.addArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Articles.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      const {
        password, __v, owner, ...userData
      } = article._doc;
      res.status(201).send(userData);
    })
    .catch(() => next(new BadReq(errMessages.badReqErrorMessage)));
};

module.exports.deleteArticle = (req, res, next) => {
  Articles.findOneAndDelete({ _id: req.params.articleId })
    .then((article) => {
      if (!article) {
        throw new NotFoundError(errMessages.notFoundArticleMsg);
      }
      if (article.owner !== req.user._id) {
        throw new Forbidden(errMessages.forbiddenErrorMsg);
      }
      const {
        password, __v, owner, ...userData
      } = article._doc;
      res.status(200).send(userData);
    })
    .catch(next);
};
