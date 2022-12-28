const { Router } = require('express');

const router = Router();
const ArticleController = require('../controllers/article');

//testing route
router.post('/create', ArticleController.create);
router.get('/articles/:lastones?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getOneArticle);
router.delete('/article/:id', ArticleController.deleteArticle);


module.exports = router;