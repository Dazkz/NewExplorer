const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, addArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getArticles);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(/^(http:\/\/|https:\/\/)(((\d{1,3}\.){3}\d{1,3}([:]\d{2,5})?)\/?|(w{3}\.)?\w+(\.\w+)?([^www]\.[a-zA-Z]{2,5})(\/\w+)*(#)?\/?)/),
    image: Joi.string().required().regex(/^(http:\/\/|https:\/\/)(((\d{1,3}\.){3}\d{1,3}([:]\d{2,5})?)\/?|(w{3}\.)?\w+(\.\w+)?([^www]\.[a-zA-Z]{2,5})(\/\w+)*(#)?\/?)/),
  }),
}), addArticle);
router.delete('/:articleId', /* celebrate({
  body: Joi.object().keys({
    articleId: Joi.string().required().length(24),
  }),
}), */ deleteArticle);

module.exports = router;
