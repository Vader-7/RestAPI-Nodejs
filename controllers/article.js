const validator = require('validator');
const Article = require('../models/Article');   

const create = (req, res) => {
    // get data from body
    let params = req.body;

    // validate data
    try {
        var validate_title = !validator.isEmpty(params.title) && validator.isLength(params.title, { min: 3 });
        var validate_content = !validator.isEmpty(params.content) && validator.isLength(params.content, { min: 5 });

        if(!validate_title || !validate_content) {
            return res.status(400).json({ message: "Error", error: "Invalid data" });
        }
    } catch(err) {
        return res.status(400).json({ message: "Error", error: err });
    }

    // create article to save
    const article = new Article(params);

    // save article to database
    article.save((err, articleStored) => {
        if(err) {
            return res.status(500).json({ message: "Error saving article to database", error: err });
        }

        if(!articleStored) {
            return res.status(500).json({ message: "Error saving article to database", error: "Article was not saved" });
        }

        return res.status(200).json({ message: "Article created", article: articleStored });
    });
}

const getArticles = (req, res) => {
    let consulta = Article.find({});

    if (req.params.lastones) {
        consulta.limit(parseInt(req.params.lastones));
    }

    consulta.sort({date: -1}).exec((err, articles) => {
        if(err) {
            return res.status(500).json({ message: "Error fetching articles from database", error: err });
        }

        if(!articles) {
            return res.status(404).json({ message: "No articles found" });
        }

        return res.status(200).json({ message: "Articles found", param: req.params.lastones, articles });
    });
}

const getOneArticle = (req, res) => {
    let articleId = req.params.id;

    if(!articleId || articleId == null) {
        return res.status(404).json({ message: "Article not found" });
    }

    Article.findById(articleId, (err, article) => {
        if(err) {
            return res.status(500).json({ message: "Error fetching article from database", error: err });
        }

        if(!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        return res.status(200).json({ message: "Article found", article });
    });
}

const deleteArticle = (req, res) => {
    let articleId = req.params.id;

    if(!articleId || articleId == null) {
        return res.status(404).json({ message: "Article not found" });
    }

    Article.findByIdAndDelete(articleId, (err, article) => {
        if(err) {
            return res.status(500).json({ message: "Error deleting article from database", error: err });
        }

        if(!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        return res.status(200).json({ message: "Article deleted", article });
    });
}

const updateArticle = (req, res) => {
    let articleId = req.params.id; 
}

module.exports = {
    create,
    getArticles,
    getOneArticle,
    deleteArticle,
    updateArticle
};

