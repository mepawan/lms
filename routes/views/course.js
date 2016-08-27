var keystone = require('keystone');
var async = require('async');
var Course = keystone.list('Course');
var CourseSection = keystone.list('CourseSection');
var SectionLession = keystone.list('SectionLession');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'courses';
	locals.filters = {
		course: req.params.course,
		section: req.params.section,
	};

	//locals.courses = [];
	locals.sections = [];
	locals.lessions = [];


	// Load the current course
	view.on('init', function (next) {
		var q = Course.model.findOne({
			state: 'published',
			slug: locals.filters.course,
		}).populate('author categories');
		q.exec(function (err, result) {
			locals.course = result;
			next(err);
		});
		
		
	});
	
	
	
	// Load sections on the Course
	view.on('init', function (next) {
		CourseSection.model.find()
			.where('course', locals.course)
			.where('state', 'published')
			.sort('title')
			.exec(function (err, sections) {
				if (err) return res.err(err);
				if (!sections) return res.notfound('Course sections not found');
				locals.sections = sections;
				//next();
				// Load the counts for each category
				async.each(locals.sections, function (section, next) {
					keystone.list('SectionLession').model.where('state', 'published').where('section').in([section.id]).exec(function (err, lres) {
						section.lessions = lres;
						next(err);
					});

				}, function (err) {
					next(err);
				});

			});
	});
/*	
	// Load lessions on the all sections of Course
	view.on('init', function (next) {
		SectionLession.model.find()
			.where('section').in(locals.sections)
			.where('state', 'published')
			.sort('title')
			.exec(function (err, lessions) {
				if (err) return res.err(err);
				if (!lessions) return res.notfound('Lessions not found');
				var tmp_lessions = [];
				for(var i in lessions){
					tmp_lessions[lessions[i].section.slug][lessions[i].id] = lessions[i];
				}
				locals.lessions = tmp_lessions;
				next();
			});
	});
*/	
	
	
	
	
/*	
	// Load other courses  
	view.on('init', function (next) {
		var q = Course.model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		q.exec(function (err, results) {
			locals.courses = results;
			next(err);
		});
	});

	// Load the current section filter
	view.on('init', function (next) {
		if (req.params.section) {
			CourseSection.model.findOne({ slug: req.params.section }).exec(function (err, result) {
				locals.section = result;
				next(err);
			});
		} else {
			next();
		}
	});
*/

	// Render the view
	view.render('course');

}
