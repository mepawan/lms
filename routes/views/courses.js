var keystone = require('keystone');
var async = require('async');
var Course = keystone.list('Course');
var CourseCategory = keystone.list('CourseCategory');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'courses';
	locals.filters = {
		category: req.params.category,
	};
	locals.courses = [];
	locals.categories = [];

	// Load all categories
	view.on('init', function (next) {

		CourseCategory.model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.categories = results;

			// Load the counts for each category
			async.each(locals.categories, function (category, next) {

				keystone.list('Course').model.count().where('state', 'published').where('categories').in([category.id]).exec(function (err, count) {
					category.courseCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});

		});

	});

	// Load the current category filter
	view.on('init', function (next) {
		if (req.params.category) {
			CourseCategory.model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the courses
	view.on('init', function (next) {

		var q = Course.paginate({
				page: req.query.page || 1,
 				perPage: 10,
 				maxPages: 10,
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.category) {
			q.where('categories').in([locals.category]);
		}

		q.exec(function (err, results) {
			locals.courses = results;
			next(err);
		});

	});

	// Render the view
	view.render('courses');

}
