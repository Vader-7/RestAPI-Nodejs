const validator = require('validator');

const validateArticles = (params) => {
	var validate_title = !validator.isEmpty(params.title) && validator.isLength(params.title, { min: 3 });
	var validate_content = !validator.isEmpty(params.content) && validator.isLength(params.content, { min: 5 });

	if (!validate_title || !validate_content) {
		return res.status(400).json({ message: 'Invalid data' });
	}
};

module.exports = {
    validateArticles
}