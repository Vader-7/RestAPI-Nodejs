const { Router } = require('express');
const multer = require('multer');
const ArticleController = require('../controllers/article');

const router = Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './img/');
  },
  filename: function(req, file, cb) {
    cb(null, "article" + new Date().toISOString() + file.originalname);
  }
});

const upload = multer({ storage });

//testing route
router.post('/create', ArticleController.create);
router.get('/articles/:lastones?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getOneArticle);
router.delete('/article/:id', ArticleController.deleteArticle);
router.put('/article/:id', ArticleController.updateArticle);
router.post('/upload-image/:id', upload.single("file"), ArticleController.uploadImg);
router.get('/image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.searchArticles);

module.exports = router;
