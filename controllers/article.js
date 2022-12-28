const fs = require('fs');
const Article = require('../models/Article');
const { validateArticles } = require('../helpers/validate');
const path = require('path');


const create = (req, res) => {
	// get data from body
	let params = req.body;
	// validate data
	try {
		validateArticles(params);
	} catch (err) {
		return res.status(400).json({ message: 'Invalid data', error: err });
	}
	// create article to save
	const article = new Article(params);
	// save article to database
	article.save((err, articleStored) => {
		if (err) {
			return res.status(500).json({ message: 'Error saving article to database', error: err });
		}

		if (!articleStored) {
			return res.status(500).json({ message: 'Error saving article to database', error: 'Article was not saved' });
		}

		return res.status(200).json({ message: 'Article created', article: articleStored });
	});
};

const getArticles = (req, res) => {
	let consulta = Article.find({});

	if (req.params.lastones) {
		consulta.limit(parseInt(req.params.lastones));
	}

	consulta.sort({ date: -1 }).exec((err, articles) => {
		if (err) {
			return res.status(500).json({ message: 'Error fetching articles from database', error: err });
		}

		if (!articles) {
			return res.status(404).json({ message: 'No articles found' });
		}

		return res.status(200).json({ message: 'Articles found', param: req.params.lastones, articles });
	});
};

const getOneArticle = (req, res) => {
	let articleId = req.params.id;

	if (!articleId || articleId == null) {
		return res.status(404).json({ message: 'Article not found' });
	}

	Article.findById(articleId, (err, article) => {
		if (err) {
			return res.status(500).json({ message: 'Error fetching article from database', error: err });
		}

		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		return res.status(200).json({ message: 'Article found', article });
	});
};

const deleteArticle = (req, res) => {
	let articleId = req.params.id;

	if (!articleId || articleId == null) {
		return res.status(404).json({ message: 'Article not found' });
	}

	Article.findByIdAndDelete(articleId, (err, article) => {
		if (err) {
			return res.status(500).json({ message: 'Error deleting article from database', error: err });
		}

		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		return res.status(200).json({ message: 'Article deleted', article });
	});
};

const updateArticle = (req, res) => {
	// get id
	const articleId = req.params.id;
	//
	// get body data
	const params = req.body;
	// validate data
	try {
		validateArticles(params);
	} catch (err) {
		return res.status(400).json({ message: 'Invalid data', error: err });
	}
	// find and update
	Article.findByIdAndUpdate(articleId, params, { new: true }, (err, articleUpdated) => {
		if (err) {
			return res.status(500).json({ message: 'Error updating article from database', error: err });
		}
		if (!articleUpdated) {
			return res.status(404).json({ message: 'Article not found' });
		}
		return res.status(200).json({ message: 'Article updated', article: articleUpdated });
	});
};

const uploadImg = (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}

	let nameFile = req.file.originalname;
	let ext = nameFile.split('.').pop();
	if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'gif') {
		fs.unlink(req.file.path, (err) => {
			if (err) {
				return res.status(500).json({ message: 'Error deleting invalid file', error: err });
			}
			return res.status(400).json({ message: 'Invalid file' });
		});
	} else {
		const articleId = req.params.id;
		// find and update
		Article.findById(articleId, (err, article) => {
			if (err) return res.status(500).json({ message: 'Error fetching article from database', error: err });
			if (!article) {
				return res.status(404).json({ message: 'Article not found' });
			}
			// delete old image file
			fs.unlink(`./img/${article.image}`, (err) => {
				if (err) {
					return res.status(500).json({ message: 'Error deleting old image file', error: err });
				}
				// update article with new image
				Article.findByIdAndUpdate(articleId, { image: req.file.filename }, { new: true }, (err, articleUpdated) => {
					if (err) {
						return res.status(500).json({ message: 'Error updating article from database', error: err });
					}
					return res.status(200).json({ message: 'Article updated', article: articleUpdated });
				});
			});
		});
	}
};

const getImage = (req, res) => {
	let file = req.params.image;
	let pathFile = `./img/${file}`;
	fs.access(pathFile, fs.constants.F_OK, (err) => {
		if (err) {
			return res.status(404).json({ message: 'Image not found' });
		} else {
			return res.sendFile(path.resolve(pathFile));
		}
	});
};

const searchArticles = (req, res) => {
	//get search string
	let searchString = req.params.search;
	//find OR 
	Article.find({
		"$or": [
			{ "title": { "$regex": searchString, "$options": "i" } },
			{ "content": { "$regex": searchString, "$options": "i" } }]
	}).sort({ date: -1 }).exec((err, articles) => {
		if (err) {
			return res.status(500).json({ message: 'Error fetching articles from database', error: err });
		}
		if (!articles || articles.length === 0) {
			return res.status(404).json({ message: 'No articles found' });
		} else {
			return res.status(200).json({ message: 'Articles found', articles });
		}
	});
}


module.exports = {
	create,
	getArticles,
	getOneArticle,
	deleteArticle,
	updateArticle,
	uploadImg,
	getImage,
	searchArticles
};
